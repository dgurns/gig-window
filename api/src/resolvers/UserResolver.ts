import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import { getManager } from 'typeorm';
import { User } from 'entities/User';
import { SignUpInput, LogInInput } from 'resolvers/inputs/UserInputs';
import { CustomContext } from 'authChecker';

@Resolver()
export class UserResolver {
  @Query(() => [User])
  getAllUsers() {
    return User.find();
  }

  @Query(() => User, { nullable: true })
  getUser(@Arg('id') id: string) {
    return User.findOne({ where: { id } });
  }

  @Query(() => User, { nullable: true })
  getCurrentUser(@Ctx() ctx: CustomContext) {
    return ctx.getUser();
  }

  @Mutation(() => User)
  async signUp(@Arg('data') data: SignUpInput, @Ctx() ctx: CustomContext) {
    const { email, username, password } = data;
    if (!email || !username || !password) {
      throw new Error('Please fill out all the fields');
    }

    const urlSlug = username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    const existingUser = await getManager()
      .createQueryBuilder(User, 'user')
      .where(
        'user.email = :email OR user.username = :username OR user.urlSlug = :urlSlug',
        { email, username, urlSlug }
      )
      .getOne();
    if (existingUser) {
      const emailAlreadyExists = existingUser.email === email;
      throw new Error(
        emailAlreadyExists
          ? 'There is already an account under that email address. Please log in'
          : 'That username is taken, please pick another one'
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const streamKey = uuidv4().replace(/-/g, '');

    const user = User.create({
      email: data.email,
      username: data.username,
      hashedPassword,
      urlSlug,
      streamKey,
    });
    await user.save();
    await ctx.login(user);

    return user;
  }

  @Mutation(() => User)
  async logIn(@Arg('data') data: LogInInput, @Ctx() ctx: CustomContext) {
    const { user } = await ctx.authenticate('graphql-local', {
      email: data.email,
      password: data.password,
    });

    if (user) {
      await ctx.login(user);
      return user;
    }
  }

  @Mutation(() => Boolean)
  logOut(@Ctx() ctx: CustomContext) {
    ctx.logout();
    return true;
  }
}
