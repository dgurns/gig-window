import { Resolver, Authorized, Mutation, Args, Arg, Ctx } from 'type-graphql';
import { CustomContext } from 'authChecker';
import { UpdateUserIsAllowedToStreamArgs } from './types/AdminResolver';
import { User, UserPermission } from 'entities/User';

const restrictToAdmin = (user: User) => {
  if (!user) throw new Error('User must be logged in');

  if (!user.permissions.includes(UserPermission.Admin)) {
    throw new Error('User is not an Admin');
  }
};

@Resolver()
export class AdminResolver {
  @Mutation(() => User)
  @Authorized(UserPermission.Admin)
  async updateUserIsAllowedToStream(
    @Args() { userId, isAllowedToStream }: UpdateUserIsAllowedToStreamArgs,
    @Ctx() ctx: CustomContext
  ) {
    const userToModify = await User.findOne({ id: userId });
    if (!userToModify) throw new Error('Could not find user with that ID');

    userToModify.isAllowedToStream = isAllowedToStream;
    await userToModify.save();

    return userToModify;
  }

  @Mutation(() => User)
  @Authorized(UserPermission.Admin)
  async makeUserAdmin(
    @Arg('userId') userId: number,
    @Ctx() ctx: CustomContext
  ) {
    const userToModify = await User.findOne({ id: userId });
    if (!userToModify) throw new Error('Could not find user with that ID');

    const existingPermissions = userToModify.permissions;
    if (!existingPermissions.includes(UserPermission.Admin)) {
      userToModify.permissions = [...existingPermissions, UserPermission.Admin];
      await userToModify.save();
    }

    return userToModify;
  }
}
