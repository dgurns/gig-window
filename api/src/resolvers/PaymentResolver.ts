import { Query, Resolver, Mutation, Arg, Args, Ctx } from 'type-graphql';
import StripeLib from 'stripe';
import { getManager } from 'typeorm';
import subHours from 'date-fns/subHours';
import { CustomContext } from 'authChecker';
import {
  GetUserPaymentForShowArgs,
  GetUserPaymentsToPayeeArgs,
  CreatePaymentInput,
  SetupIntent,
  PaymentMethod,
} from './types/PaymentResolver';
import { User } from 'entities/User';
import { Payment } from 'entities/Payment';
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

  @Query(() => Payment, { nullable: true })
  getUserPaymentForShow(
    @Args() { showId }: GetUserPaymentForShowArgs,
    @Ctx() ctx: CustomContext
  ) {
    const user = ctx.getUser();
    if (!user) throw new Error('User is not logged in');

    return Payment.findOne({ where: { userId: user.id, showId } });
  }

  @Query(() => [Payment])
  async getUserPaymentsToPayee(
    @Args() { payeeUserId, onlyRecent }: GetUserPaymentsToPayeeArgs,
    @Ctx() ctx: CustomContext
  ) {
    const user = ctx.getUser();
    if (!user) throw new Error('User is not logged in');

    const recencyThreshold = subHours(new Date(), 24);
    const dateToCompareAsSqlString = recencyThreshold
      .toISOString()
      .replace('T', ' ');
    const payments = await getManager()
      .createQueryBuilder(Payment, 'payment')
      .where('payment.payeeUserId = :payeeUserId', { payeeUserId })
      .andWhere(
        onlyRecent
          ? 'payment.createdAt > :recencyThreshold'
          : 'payment.createdAt',
        {
          recencyThreshold: dateToCompareAsSqlString,
        }
      )
      .orderBy('payment.createdAt', 'ASC')
      .getMany();
    return payments;
  }

  @Mutation((returns) => Payment)
  async createPayment(
    @Arg('data') data: CreatePaymentInput,
    @Ctx() ctx: CustomContext
  ): Promise<Payment> {
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
      const payment = Payment.create({
        userId: user.id,
        payeeUserId: payee.id,
        amountInCents: data.amountInCents,
        showId: data.showId,
      });
      await payment.save();
      return payment;
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
