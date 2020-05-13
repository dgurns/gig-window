import { ObjectType, InputType, Field, Int } from 'type-graphql';

@InputType()
export class CreatePaymentInput {
  @Field((type) => Int)
  amountInCents: number;

  @Field((type) => Int)
  payeeUserId: number;

  @Field((type) => Boolean)
  shouldDetachPaymentMethodAfter: boolean;
}

@ObjectType()
export class SetupIntent {
  @Field((type) => String)
  client_secret: string;
}
