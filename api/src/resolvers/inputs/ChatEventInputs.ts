import { InputType, Field } from 'type-graphql';

@InputType()
export class CreateChatEventInput {
  @Field()
  parentUrlSlug: string;

  @Field()
  type: string;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  tipAmount?: number;
}
