import { ArgsType, InputType, Field, Int } from 'type-graphql';

@InputType()
export class CreateChatInput {
  @Field((type) => Int)
  parentUserId: number;

  @Field()
  message: string;
}
