import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export class GetChatEventsArgs {
  @Field((type) => Int)
  parentUserId: number;
}

@ArgsType()
export class NewChatEventArgs {
  @Field((type) => Int)
  parentUserId: number;
}
