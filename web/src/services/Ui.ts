import { PaymentForShow, RecentPaymentToPayee } from 'hooks/usePayments';
import UserService from 'services/User';
import { User } from 'types';

interface ShouldShowTipButtonArgs {
  user?: User;
  payee?: User;
  isActiveShow?: boolean;
  paymentForShow?: PaymentForShow;
  recentPaymentsToPayee?: RecentPaymentToPayee[];
  freePreviewIsUsed?: boolean;
}

/**
 * shouldShowTipButton handles the logic for when to display the Tip button.
 * Generally, the "Buy ticket" button takes precedence; once a user has bought
 * a ticket or made a recent payment, then they should see the Tip button.
 */
const shouldShowTipButton = ({
  user,
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

  // If the user is an Admin and hasn't bought a ticket for the show, they
  // should still see the Tip button in case they want to tip
  if (isStreamingLive && UserService.isAdmin(user)) {
    return true;
  }

  return false;
};

const UiService = {
  shouldShowTipButton,
};
export default UiService;
