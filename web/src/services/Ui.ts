import { PaymentForShow, RecentPaymentToPayee } from 'hooks/usePayments';
import { User } from 'types';

interface ShouldShowTipButtonArgs {
  payee?: User;
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
    payee.muxLiveStreamStatus === 'active' && payee.isInPublicMode
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
