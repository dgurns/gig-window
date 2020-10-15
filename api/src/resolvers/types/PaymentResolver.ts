import { ArgsType, ObjectType, InputType, Field, Int } from 'type-graphql';
import Stripe from 'stripe';

@ArgsType()
export class GetUserPaymentsArgs {
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  offset: number;

  @Field(() => Int, { nullable: true, defaultValue: 30 })
  limit: number;
}

@ArgsType()
export class GetUserPaymentForShowArgs {
  @Field(() => Int)
  showId: number;
}

@ArgsType()
export class GetUserPaymentsToPayeeArgs {
  @Field(() => Int)
  payeeUserId: number;

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  onlyRecent: boolean;
}

@InputType()
export class ChargeCardAsPayeeInput {
  @Field(() => Int)
  amountInCents: number;

  @Field(() => Int)
  payeeUserId: number;

  @Field(() => Int, { nullable: true })
  showId?: number;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  shouldDetachPaymentMethodAfter?: boolean;
}

@InputType()
export class RefundPaymentInput {
  @Field(() => Int)
  paymentId: number;
}

@ObjectType()
export class StripeSetupIntent {
  @Field(() => String)
  client_secret: string;
}

@ObjectType()
class StripeCard {
  @Field(() => String)
  brand: string;

  @Field(() => String)
  last4: string;
}

@ObjectType()
export class StripePaymentMethod {
  @Field(() => String)
  id: string;

  @Field(() => StripeCard, { nullable: true })
  card?: Stripe.PaymentMethod.Card;

  @Field(() => Int)
  created: number;

  @Field(() => String)
  type: Stripe.PaymentMethod.Type;
}
