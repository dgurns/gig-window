import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import { CustomContext } from 'authChecker';
import { Chat } from 'entities/Chat';
import { User } from 'entities/User';
import { CreateChatInput } from './inputs/ChatInputs';

@Resolver()
export class ChatResolver {
  @Query(() => [Chat])
  async getChats(@Arg('parentUrlSlug') parentUrlSlug: string) {
    const parentUser = await User.findOne({
      where: { urlSlug: parentUrlSlug },
    });
    if (!parentUser) return [];

    const chats = await Chat.find({
      where: { parentUser: parentUser },
      relations: ['user', 'parentUser'],
    });
    return chats;
  }

  @Mutation(() => Chat)
  async createChat(
    @Arg('data') data: CreateChatInput,
    @Ctx() ctx: CustomContext
  ) {
    const user = ctx.getUser();
    if (!user) {
      throw new Error('User must be logged in to chat');
    }

    const parentUser = await User.findOne({
      where: { urlSlug: data.parentUrlSlug },
    });
    if (!parentUser) {
      throw new Error('Could not find parent user');
    }

    const chat = Chat.create({
      user,
      parentUser,
      message: data.message,
    });
    await chat.save();

    return chat;
  }
}
