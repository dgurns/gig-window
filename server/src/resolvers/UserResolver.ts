import bcrypt from 'bcrypt';
import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
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
    const existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new Error(
        'There is already an account under that email address. Please log in or use another email.'
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = User.create({
      email: data.email,
      username: data.username,
      hashedPassword
    });
    await user.save();

    await ctx.login(user);

    return user;
  }

  @Mutation(() => User)
  async logIn(@Arg('data') data: LogInInput, @Ctx() ctx: CustomContext) {
    const { user } = await ctx.authenticate('graphql-local', {
      email: data.email,
      password: data.password
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
