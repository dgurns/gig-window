import { ArgsType, InputType, Field, Int } from 'type-graphql';
import { User } from 'entities/User';

@ArgsType()
export class GetChatEventsArgs {
  @Field((type) => Int)
  parentUserId: number;
}

@InputType()
export class CreateChatInput {
  @Field((type) => Int)
  parentUserId: number;

  @Field()
  message: string;
}

@ArgsType()
export class NewChatEventArgs {
  @Field((type) => Int)
  parentUserId: number;
}

export interface NewChatEventPayload {
  user: User;
  message?: string;
}
