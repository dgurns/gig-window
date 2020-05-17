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
export class PaymentMethod {
  @Field((type) => String)
  id: string;

  @Field((type) => Object, { nullable: true })
  card?: Stripe.PaymentMethod.Card;

  @Field((type) => Int)
  created: number;

  @Field((type) => Object)
  metadata: Stripe.Metadata;

  @Field((type) => String)
  type: Stripe.PaymentMethod.Type;
}
