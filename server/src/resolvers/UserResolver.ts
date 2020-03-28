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

  @Query(() => User)
  getUser(@Arg('id') id: string) {
    return User.findOne({ where: { id } });
  }

  @Mutation(() => User)
  async signUp(@Arg('data') data: SignUpInput, @Ctx() ctx: CustomContext) {
    const user = User.create(data);
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
    }

    return user;
  }
}
