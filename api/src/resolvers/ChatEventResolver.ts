import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import { CustomContext } from 'authChecker';
import { ChatEvent, ChatEventType } from 'entities/ChatEvent';
import { User } from 'entities/User';
import { CreateChatEventInput } from './inputs/ChatEventInputs';

@Resolver()
export class ChatEventResolver {
  @Query(() => [ChatEvent])
  async getChatEventsForParent(@Arg('parentUrlSlug') parentUrlSlug: string) {
    const parentUser = await User.findOne({
      where: { urlSlug: parentUrlSlug },
    });
    if (!parentUser) throw new Error('Could not find the parent user');

    const chatEvents = await ChatEvent.find({
      where: { parentUserId: parentUser.id },
    });
    return chatEvents;
  }

  @Mutation(() => ChatEvent)
  async createChatEvent(
    @Arg('data') data: CreateChatEventInput,
    @Ctx() ctx: CustomContext
  ) {
    const user = ctx.getUser();
    if (!user) {
      throw new Error('User must be logged in to chat');
    } else if (!(<any>Object).values(ChatEventType).includes(data.type)) {
      throw new Error('Invalid chat event type');
    }

    const parentUser = await User.findOne({
      where: { urlSlug: data.parentUrlSlug },
    });
    if (!parentUser) {
      throw new Error('Could not find parent user');
    }

    const chatEvent = new ChatEvent();
    chatEvent.user = user;
    chatEvent.parentUser = parentUser;
    chatEvent.type = data.type;
    chatEvent.message = data.message;
    chatEvent.tipAmount = data.tipAmount;
    await chatEvent.save();

    return chatEvent;
  }
}
