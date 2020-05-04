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
import {
  GetChatEventsArgs,
  CreateChatInput,
  NewChatEventArgs,
} from './types/ChatResolver';

@Resolver()
export class ChatResolver {
  @Query(() => [Chat])
  async getChatEvents(@Args() { parentUserId }: GetChatEventsArgs) {
    const chats = await Chat.find({
      where: { parentUserId },
      relations: ['user', 'parentUser'],
      take: 10,
    });

    // When tips exist, pull them and combine with chats

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

  @Subscription({
    topics: ['CHAT_CREATED'],
    filter: ({ payload, args }) => {
      if (payload.parentUserId === args.parentUserId) {
        return true;
      }
      return false;
    },
  })
  newChatEvent(
    @Root() payload: Chat,
    @Args() { parentUserId }: NewChatEventArgs
  ): Chat {
    return payload;
  }
}
