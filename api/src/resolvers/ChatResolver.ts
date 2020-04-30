import {
  Resolver,
  Query,
  Mutation,
  Subscription,
  PubSub,
  Publisher,
  Root,
  Args,
  Arg,
  Ctx,
} from 'type-graphql';
import { CustomContext } from 'authChecker';
import { Chat } from 'entities/Chat';
import { User } from 'entities/User';
import { CreateChatInput, NewChatEventArgs } from './types/ChatResolver';

@Resolver()
export class ChatResolver {
  @Query(() => [Chat])
  async getChats(@Arg('parentUrlSlug') parentUrlSlug: string) {
    const parentUser = await User.findOne({
      where: { urlSlug: parentUrlSlug },
    });
    if (!parentUser) return [];

    const chats = await Chat.find({
      where: { parentUserId: parentUser.id },
      relations: ['user', 'parentUser'],
    });
    return chats;
  }

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

    const parentUser = await User.findOne({
      where: { urlSlug: data.parentUrlSlug },
    });
    if (!parentUser) {
      throw new Error('Could not find parent user');
    }

    const chat = Chat.create({
      userId: user.id,
      parentUserId: parentUser.id,
      message: data.message,
    });
    await chat.save();

    await publish(chat);

    return chat;
  }

  @Subscription({
    topics: ['CHAT_CREATED'],
    filter: ({ payload, args }) => {
      console.log('filtering payload and args', payload, args);
      return true;
    },
  })
  newChatEvent(@Root() payload: Chat, @Args() args: NewChatEventArgs): Chat {
    console.log('args', args);
    return payload;
  }
}
