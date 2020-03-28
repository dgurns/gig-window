import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { User } from 'entities/User';
import { CreateUserInput } from 'resolvers/inputs/CreateUserInput';

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
  async createUser(@Arg('data') data: CreateUserInput) {
    const user = User.create(data);
    await user.save();
    return user;
  }
}
