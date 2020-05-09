import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class CreatePaymentIntentInput {
  @Field((type) => Int)
  amountInCents: number;

  @Field((type) => Int)
  payeeUserId: number;
}
