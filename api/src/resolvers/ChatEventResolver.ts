import { Resolver, Query, Subscription, Root, Args } from 'type-graphql';
import { compareAsc } from 'date-fns';
import { Chat } from 'entities/Chat';
import { Payment } from 'entities/Payment';
import { ChatEvent } from 'entities/ChatEvent';
import { GetChatEventsArgs, NewChatEventArgs } from './types/ChatEventResolver';

@Resolver()
export class ChatEventResolver {
  @Query(() => [ChatEvent])
  async getChatEvents(@Args() { parentUserId }: GetChatEventsArgs) {
    const chats = await Chat.find({
      where: { parentUserId },
      relations: ['user'],
      order: {
        createdAt: 'DESC',
      },
      take: 10,
    });
    const payments = await Payment.find({
      where: { payeeUserId: parentUserId },
      relations: ['user', 'payeeUser'],
      order: {
        createdAt: 'DESC',
      },
      take: 10,
    });

    const chatsAndPayments = [...chats, ...payments];
    const sortedChatsAndPayments = chatsAndPayments.sort((item1, item2) =>
      compareAsc(new Date(item1.createdAt), new Date(item2.createdAt))
    );
    const chatEvents = sortedChatsAndPayments.map((item) => {
      const chatEvent = new ChatEvent();
      if (item instanceof Chat) {
        chatEvent.chat = item;
      } else if (item instanceof Payment) {
        chatEvent.payment = item;
      }
      return chatEvent;
    });

    return chatEvents;
  }

  @Subscription({
    topics: ['CHAT_CREATED', 'PAYMENT_CREATED'],
    filter: ({ payload, args }) => {
      const isRelevantChat = payload.parentUserId === args.parentUserId;
      const isRelevantPayment = payload.payeeUserId === args.parentUserId;
      if (isRelevantChat || isRelevantPayment) {
        return true;
      }
      return false;
    },
  })
  newChatEvent(
    @Root() payload: Chat | Payment,
    @Args() { parentUserId }: NewChatEventArgs
  ): ChatEvent {
    const chatEvent = new ChatEvent();
    const isChat = payload.hasOwnProperty('parentUserId');
    const isPayment = payload.hasOwnProperty('payeeUserId');
    if (isChat) {
      chatEvent.chat = payload as Chat;
    } else if (isPayment) {
      chatEvent.payment = payload as Payment;
    }
    return chatEvent;
  }
}
