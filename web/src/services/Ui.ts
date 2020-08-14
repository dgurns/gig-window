import { PaymentForShow, RecentPaymentToPayee } from 'hooks/usePayments';

interface ShouldShowTipButtonArgs {
  payee?: {
    stripeConnectAccountId?: string;
    isPublishingStream: boolean;
    isInPublicMode: boolean;
  };
  isActiveShow?: boolean;
  paymentForShow?: PaymentForShow;
  recentPaymentsToPayee?: RecentPaymentToPayee[];
  freePreviewIsUsed?: boolean;
}

const shouldShowTipButton = ({
  payee,
  isActiveShow,
  paymentForShow,
  recentPaymentsToPayee,
}: ShouldShowTipButtonArgs) => {
  if (!payee || !payee.stripeConnectAccountId) {
    return false;
  }

  const isStreamingLive = Boolean(
    payee.isPublishingStream && payee.isInPublicMode
  );
  if (!isActiveShow && !isStreamingLive) {
    return true;
  }

  if (isActiveShow && paymentForShow) {
    return true;
  }

  if (
    isStreamingLive &&
    (Boolean(paymentForShow) || Boolean(recentPaymentsToPayee?.length))
  ) {
    return true;
  }

  return false;
};

export default {
  shouldShowTipButton,
};
