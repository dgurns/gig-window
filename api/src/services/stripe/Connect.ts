import StripeLib from 'stripe';
import { User } from 'entities/User';
import Payment from 'services/Payment';
import Stripe from 'services/stripe/Stripe';

const stripe = new StripeLib(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2020-03-02',
});

const validateOauthAuthorizationCode = (authorizationCode: string) => {
  return stripe.oauth.token({
    grant_type: 'authorization_code',
    code: authorizationCode,
  });
};

const clonePaymentMethodAsPayee = (args: {
  customerId: string;
  paymentMethodId: string;
  stripeAccountId: string;
}): Promise<StripeLib.PaymentMethod> => {
  return stripe.paymentMethods.create(
    {
      customer: args.customerId,
      payment_method: args.paymentMethodId,
    },
    {
      stripeAccount: args.stripeAccountId,
    }
  );
};

const createPaymentIntentAsPayee = async (args: {
  amountInCents: number;
  user: User;
  payee: User;
}): Promise<StripeLib.PaymentIntent> => {
  const { user, payee, amountInCents } = args;

  if (!user.stripeCustomerId) {
    throw new Error('User does not have Stripe customer ID');
  } else if (!payee.stripeAccountId) {
    throw new Error('Payee does not have Stripe account ID');
  }

  const applicationFeeInCents = Payment.calculateApplicationFeeAmount(
    amountInCents
  );
  const shortenedPayeeUsername = payee.username.slice(0, 10);

  const paymentMethodToClone = await Stripe.getLatestPaymentMethodForUser(user);
  const clonedPaymentMethod = await clonePaymentMethodAsPayee({
    customerId: user.stripeCustomerId,
    paymentMethodId: paymentMethodToClone?.id ?? '',
    stripeAccountId: payee.stripeAccountId,
  });

  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount: amountInCents,
      payment_method: clonedPaymentMethod.id,
      confirm: true,
      off_session: true,
      currency: 'usd',
      description: `Payment from: Username "${user.username}" / Email "${user.email}"`,
      receipt_email: user.email,
      statement_descriptor: `Payment to ${shortenedPayeeUsername}`,
      statement_descriptor_suffix: `Payment to ${shortenedPayeeUsername}`,
      application_fee_amount: applicationFeeInCents,
      metadata: {
        userEmail: user.email,
        userUsername: user.username,
        userId: user.id,
        payeeUserId: payee.id,
      },
    },
    {
      stripeAccount: payee.stripeAccountId,
    }
  );

  return paymentIntent;
};

export default {
  validateOauthAuthorizationCode,
  createPaymentIntentAsPayee,
};