import { ObjectType, InputType, Field, Int } from 'type-graphql';

@ObjectType()
export class PaymentIntent {
  @Field((type) => String)
  client_secret: string;
}

@InputType()
export class CreatePaymentIntentInput {
  @Field((type) => Int)
  amountInCents: number;

  @Field((type) => Int)
  payeeUserId: number;
}

@ObjectType()
export class SetupIntent {
  @Field((type) => String)
  client_secret: string;
}
