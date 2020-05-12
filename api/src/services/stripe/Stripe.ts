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
}): Promise<Stripe.PaymentIntent> => {
  if (!args.user.stripeCustomerId) {
    throw new Error('User does not have Stripe customer ID');
  } else if (!args.payee.stripeAccountId) {
    throw new Error('Payee does not have Stripe account ID');
  }

  const applicationFeeInCents = Payment.calculateApplicationFeeAmount(
    args.amountInCents
  );
  const shortenedPayeeUsername = args.payee.username.slice(0, 10);

  const paymentIntent = await stripe.paymentIntents.create(
    {
      payment_method_types: ['card'],
      amount: args.amountInCents,
      currency: 'usd',
      description: `Payment from: Username "${args.user.username}" / Email "${args.user.email}"`,
      receipt_email: args.user.email,
      statement_descriptor: `Payment to ${shortenedPayeeUsername}`,
      statement_descriptor_suffix: `Payment to ${shortenedPayeeUsername}`,
      application_fee_amount: applicationFeeInCents,
      metadata: {
        userEmail: args.user.email,
        userUsername: args.user.username,
        userId: args.user.id,
        payeeUserId: args.payee.id,
      },
    },
    {
      stripeAccount: args.payee.stripeAccountId,
    }
  );

  return paymentIntent;
};

const createSetupIntent = async (args: {
  user: User;
  payee: User;
}): Promise<Stripe.SetupIntent> => {
  if (!args.user.stripeCustomerId) {
    throw new Error('User does not have Stripe customer ID');
  } else if (!args.payee.stripeAccountId) {
    throw new Error('Payee does not have Stripe account ID');
  }

  const setupIntent = await stripe.setupIntents.create(
    {
      payment_method_types: ['card'],
      usage: 'off_session',
      metadata: {
        userId: args.user.id,
        payeeUserId: args.payee.id,
      },
    },
    {
      stripeAccount: args.payee.stripeAccountId,
    }
  );

  return setupIntent;
};

export default {
  maybeCreateStripeCustomerForUser,
  createPaymentIntent,
  createSetupIntent,
};
