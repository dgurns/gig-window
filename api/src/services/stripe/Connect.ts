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
  stripeConnectAccountId: string;
}): Promise<StripeLib.PaymentMethod> => {
  return stripe.paymentMethods.create(
    {
      customer: args.customerId,
      payment_method: args.paymentMethodId,
    },
    {
      stripeAccount: args.stripeConnectAccountId,
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
  } else if (!payee.stripeConnectAccountId) {
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
    stripeConnectAccountId: payee.stripeConnectAccountId,
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
      stripeAccount: payee.stripeConnectAccountId,
    }
  );

  return paymentIntent;
};

const refundPaymentIntentAsPayee = (args: {
  paymentIntentId: string;
  stripeConnectAccountId: string;
}): Promise<StripeLib.Refund> => {
  return stripe.refunds.create(
    {
      payment_intent: args.paymentIntentId,
      reason: 'requested_by_customer',
      refund_application_fee: true,
    },
    {
      stripeAccount: args.stripeConnectAccountId,
    }
  );
};

export default {
  validateOauthAuthorizationCode,
  createPaymentIntentAsPayee,
  refundPaymentIntentAsPayee,
};
