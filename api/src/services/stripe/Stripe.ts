import Stripe from 'stripe';
import { User } from 'entities/User';

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

export default {
  maybeCreateStripeCustomerForUser,
};
