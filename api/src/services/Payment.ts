const STRIPE_FEE_AMOUNT_IN_CENTS = 30;
const STRIPE_FEE_PERCENTAGE = 2.9;
const APPLICATION_FEE_PERCENTAGE = 20;

const calculateApplicationFeeAmount = (
  paymentAmountInCents: number
): number => {
  const totalStripeFeesInCents =
    paymentAmountInCents * STRIPE_FEE_PERCENTAGE + STRIPE_FEE_AMOUNT_IN_CENTS;
  const paymentAmountAfterStripeFees =
    paymentAmountInCents - totalStripeFeesInCents;
  return paymentAmountAfterStripeFees * (APPLICATION_FEE_PERCENTAGE / 100);
};

export default {
  calculateApplicationFeeAmount,
};
