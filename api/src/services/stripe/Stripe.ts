import Stripe from 'stripe';
import { User } from 'entities/User';
import Payment from 'services/Payment';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2020-03-02',
});

const maybeCreateStripeCustomerForUser = async (
  user: User
): Promise<string> => {
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const response = await stripe.customers.create({
    email: user.email,
    description: user.username,
  });

  if (response.id) {
    user.stripeCustomerId = response.id;
    await user.save();
    return user.stripeCustomerId;
  } else {
    throw new Error('Error creating Stripe customer for that user');
  }
};

const createPaymentIntent = async (args: {
  amountInCents: number;
  user: User;
  payee: User;
  setupFutureUsage: boolean;
}): Promise<Stripe.PaymentIntent> => {
  if (!args.user.stripeCustomerId) {
    throw new Error('User does not have Stripe customer ID');
  } else if (!args.payee.stripeAccountId) {
    throw new Error('Payee does not have Stripe account ID');
  }

  const applicationFeeInCents = Payment.calculateApplicationFeeAmount(
    args.amountInCents
  );
  const shortenedUsername = args.user.username.slice(0, 10);

  const paymentIntent = await stripe.paymentIntents.create(
    {
      payment_method_types: ['card'],
      amount: args.amountInCents,
      currency: 'usd',
      customer: args.user.stripeCustomerId,
      receipt_email: args.user.email,
      setup_future_usage: args.setupFutureUsage ? 'off_session' : undefined,
      statement_descriptor: `Payment to ${shortenedUsername}`,
      statement_descriptor_suffix: `Payment to ${shortenedUsername}`,
      application_fee_amount: applicationFeeInCents,
    },
    {
      stripeAccount: args.payee.stripeAccountId,
    }
  );

  return paymentIntent;
};

export default {
  maybeCreateStripeCustomerForUser,
  createPaymentIntent,
};
