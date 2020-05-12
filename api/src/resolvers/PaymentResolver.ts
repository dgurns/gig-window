import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import StripeLib from 'stripe';
import { CustomContext } from 'authChecker';
import {
  PaymentIntent,
  CreatePaymentIntentInput,
  SetupIntent,
} from './types/PaymentResolver';
import { User } from 'entities/User';
import Stripe from 'services/stripe/Stripe';

@Resolver()
export class PaymentResolver {
  @Mutation((returns) => PaymentIntent)
  async createPaymentIntent(
    @Arg('data') data: CreatePaymentIntentInput,
    @Ctx() ctx: CustomContext
  ): Promise<StripeLib.PaymentIntent> {
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
    });

    if (paymentIntent) {
      return paymentIntent;
    } else {
      throw new Error(
        'Error creating PaymentIntent - did not return client secret'
      );
    }
  }

  @Mutation((returns) => SetupIntent)
  async createSetupIntent(
    @Ctx() ctx: CustomContext
  ): Promise<StripeLib.SetupIntent> {
    const user = ctx.getUser();
    if (!user) {
      throw new Error('User must be logged in to create a SetupIntent');
    }

    const setupIntent = await Stripe.createSetupIntent(user);

    if (setupIntent) {
      return setupIntent;
    } else {
      throw new Error(
        'Error creating SetupIntent - did not return client secret'
      );
    }
  }
}
