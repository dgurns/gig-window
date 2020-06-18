import { Resolver, Mutation, PubSub, Publisher, Arg, Ctx } from 'type-graphql';
import { CustomContext } from 'authChecker';
import { Chat } from 'entities/Chat';
import { CreateChatInput } from './types/ChatResolver';

@Resolver()
export class ChatResolver {
  @Mutation(() => Chat)
  async createChat(
    @Arg('data') data: CreateChatInput,
    @Ctx() ctx: CustomContext,
    @PubSub('CHAT_CREATED') publish: Publisher<Chat>
  ) {
    const user = ctx.getUser();
    if (!user) {
      throw new Error('User must be logged in to chat');
    }

    const chat = Chat.create({
      userId: user.id,
      parentUserId: data.parentUserId,
      message: data.message,
    });
    await chat.save();

    chat.user = user;
    await publish(chat);

    return chat;
  }
}
