import { ObjectType, InputType, Field, Int } from 'type-graphql';
import Stripe from 'stripe';

@InputType()
export class CreatePaymentInput {
  @Field((type) => Int)
  amountInCents: number;

  @Field((type) => Int)
  payeeUserId: number;

  @Field((type) => Boolean, { nullable: true, defaultValue: false })
  shouldDetachPaymentMethodAfter?: boolean;
}

@ObjectType()
export class SetupIntent {
  @Field((type) => String)
  client_secret: string;
}

@ObjectType()
class Card {
  @Field((type) => String)
  brand: string;

  @Field((type) => String)
  last4: string;
}

@ObjectType()
export class PaymentMethod {
  @Field((type) => String)
  id: string;

  @Field((type) => Card, { nullable: true })
  card?: Stripe.PaymentMethod.Card;

  @Field((type) => Int)
  created: number;

  @Field((type) => String)
  type: Stripe.PaymentMethod.Type;
}
