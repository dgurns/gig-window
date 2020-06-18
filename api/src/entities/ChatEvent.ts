import { ObjectType, Field } from 'type-graphql';
import { Chat } from './Chat';
import { Payment } from './Payment';

@ObjectType()
export class ChatEvent {
  @Field((type) => Chat, { nullable: true })
  chat?: Chat;

  @Field((type) => Payment, { nullable: true })
  payment?: Payment;
}
