import { InputType, Field } from 'type-graphql';

@InputType()
export class CreateChatInput {
  @Field()
  parentUrlSlug: string;

  @Field()
  message: string;
}
