const STRIPE_FEE_AMOUNT_IN_CENTS = 30;
const STRIPE_FEE_PERCENTAGE = 2.9;
const APPLICATION_FEE_PERCENTAGE = 20;

const calculateApplicationFeeAmount = (
  paymentAmountInCents: number
): number => {
  const totalStripeFeesInCents =
    paymentAmountInCents * (STRIPE_FEE_PERCENTAGE / 100) +
    STRIPE_FEE_AMOUNT_IN_CENTS;
  const paymentAmountAfterStripeFees =
    paymentAmountInCents - totalStripeFeesInCents;
  const rawApplicationFeeAmount =
    paymentAmountAfterStripeFees * (APPLICATION_FEE_PERCENTAGE / 100);
  return Math.round(rawApplicationFeeAmount);
};

export default {
  calculateApplicationFeeAmount,
};
