import { InputType, Field } from 'type-graphql';
import { User } from 'entities/User';

@InputType()
export class CreateChatInput {
  @Field()
  parentUrlSlug: string;

  @Field()
  message: string;
}

export interface NewChatEventPayload {
  user: User;
  message?: string;
}
