import User from './User';

interface ShouldShowTipButtonArgs {
  payee?: {
    stripeAccountId?: string;
    isPublishingStream: boolean;
    isInPublicMode: boolean;
  };
  isActiveShow?: boolean;
  userHasPaymentForShow?: boolean;
  userHasRecentPaymentToPayee?: boolean;
}

const shouldShowTipButton = ({
  payee,
  isActiveShow,
  userHasPaymentForShow,
  userHasRecentPaymentToPayee,
}: ShouldShowTipButtonArgs) => {
  if (!payee || !payee.stripeAccountId) return false;

  const isStreamingLive = User.isStreamingLive(
    payee.isPublishingStream,
    payee.isInPublicMode
  );
  if (!isActiveShow && !isStreamingLive) {
    return true;
  }

  if (isActiveShow && userHasPaymentForShow) {
    return true;
  }

  const hasAccessToLiveStream = User.hasAccessToLiveStream(
    userHasPaymentForShow,
    userHasRecentPaymentToPayee
  );
  if (isStreamingLive && hasAccessToLiveStream) {
    return true;
  }

  return false;
};

export default {
  shouldShowTipButton,
};
