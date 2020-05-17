import { Query, Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import StripeLib from 'stripe';
import { CustomContext } from 'authChecker';
import {
  CreatePaymentInput,
  SetupIntent,
  PaymentMethod,
} from './types/PaymentResolver';
import { User } from 'entities/User';
import Stripe from 'services/stripe/Stripe';
import StripeConnect from 'services/stripe/Connect';

@Resolver()
export class PaymentResolver {
  @Query(() => PaymentMethod, { nullable: true })
  getLatestPaymentMethodForUser(@Ctx() ctx: CustomContext) {
    const user = ctx.getUser();
    if (!user) throw new Error('User must be logged in');

    return Stripe.getLatestPaymentMethodForUser(user);
  }

  @Mutation((returns) => Boolean)
  async createPayment(
    @Arg('data') data: CreatePaymentInput,
    @Ctx() ctx: CustomContext
  ): Promise<Boolean> {
    const user = ctx.getUser();
    if (!user) {
      throw new Error('User must be logged in to create a Payment');
    }

    const payee = await User.findOne({ where: { id: data.payeeUserId } });
    if (!payee) {
      throw new Error('Could not find payee user');
    }

    let paymentIntent;
    try {
      paymentIntent = await StripeConnect.createPaymentIntentAsPayee({
        amountInCents: data.amountInCents,
        user,
        payee,
      });
    } catch {}

    if (data.shouldDetachPaymentMethodAfter) {
      const latestPaymentMethod = await Stripe.getLatestPaymentMethodForUser(
        user
      );
      if (latestPaymentMethod?.id) {
        await Stripe.detachPaymentMethod(latestPaymentMethod.id);
      }
    }

    if (paymentIntent?.status === 'succeeded') {
      // Save Payment to DB

      // Return the Payment to client
      return true;
    } else {
      throw new Error('Error creating PaymentIntent');
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

    const setupIntent = await Stripe.createSetupIntentForUser(user);

    if (setupIntent) {
      return setupIntent;
    } else {
      throw new Error(
        'Error creating SetupIntent - did not return client secret'
      );
    }
  }

  @Mutation((returns) => PaymentMethod)
  async detachPaymentMethodFromUser(
    @Arg('paymentMethodId') paymentMethodId: string,
    @Ctx() ctx: CustomContext
  ) {
    const user = ctx.getUser();
    if (!user) {
      throw new Error('User must be logged in to detach a payment method');
    }

    return Stripe.detachPaymentMethod(paymentMethodId);
  }
}
