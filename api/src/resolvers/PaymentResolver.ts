import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import { CustomContext } from 'authChecker';
import { CreatePaymentIntentInput } from './types/PaymentResolver';
import { User } from 'entities/User';
import Stripe from 'services/stripe/Stripe';

@Resolver()
export class PaymentResolver {
  @Mutation(() => String)
  async createPaymentIntent(
    @Arg('data') data: CreatePaymentIntentInput,
    @Ctx() ctx: CustomContext
  ) {
    const user = ctx.getUser();
    if (!user) {
      throw new Error('User must be logged in to create a PaymentIntent');
    }

    const payee = await User.findOne({ where: { id: data.payeeUserId } });
    if (!payee) {
      throw new Error('Could not find payee user');
    }

    const paymentIntent = await Stripe.createPaymentIntent({
      amountInCents: data.amountInCents,
      user,
      payee,
      setupFutureUsage: data.setupFutureUsage,
    });

    if (paymentIntent.client_secret) {
      return paymentIntent.client_secret;
    } else {
      throw new Error(
        'Error creating PaymentIntent - did not return client secret'
      );
    }
  }
}
