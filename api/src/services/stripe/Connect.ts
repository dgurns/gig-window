import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2020-03-02',
});

const validateOauthAuthorizationCode = (authorizationCode: string) => {
  return stripe.oauth.token({
    grant_type: 'authorization_code',
    code: authorizationCode,
  });
};

export default {
  validateOauthAuthorizationCode,
};
