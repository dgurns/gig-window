import Stripe from 'stripe';
import { User } from 'entities/User';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2020-08-27',
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

const createSetupIntentForUser = async (
  user: User
): Promise<Stripe.SetupIntent> => {
  if (!user.stripeCustomerId) {
    throw new Error('User does not have Stripe customer ID');
  }

  const setupIntent = await stripe.setupIntents.create({
    payment_method_types: ['card'],
    customer: user.stripeCustomerId,
    usage: 'off_session',
    metadata: {
      userId: user.id,
    },
  });

  return setupIntent;
};

const getLatestPaymentMethodForUser = async (
  user: User
): Promise<Stripe.PaymentMethod | undefined> => {
  if (!user) throw new Error('No user passed in');
  if (!user.stripeCustomerId) {
    throw new Error('User does not have an associated Stripe Customer');
  }

  const paymentMethods = await stripe.paymentMethods.list({
    customer: user.stripeCustomerId,
    type: 'card',
  });
  if (!paymentMethods.data) {
    throw new Error('No payment methods retrieved for customer');
  }
  return paymentMethods.data[0];
};

const detachPaymentMethod = (
  paymentMethodId: string
): Promise<Stripe.PaymentMethod> | void => {
  if (!paymentMethodId) return;

  return stripe.paymentMethods.detach(paymentMethodId);
};

export default {
  maybeCreateStripeCustomerForUser,
  createSetupIntentForUser,
  getLatestPaymentMethodForUser,
  detachPaymentMethod,
};
