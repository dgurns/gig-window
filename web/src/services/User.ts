import { PaymentForShow, RecentPaymentToPayee } from 'hooks/usePayments';

interface HasAccessToLiveVideoArgs {
  paymentForShow?: PaymentForShow | undefined;
  recentPaymentsToPayee?: RecentPaymentToPayee[] | undefined;
  freePreviewIsUsed?: boolean;
}

const hasAccessToLiveVideo = ({
  paymentForShow,
  recentPaymentsToPayee,
  freePreviewIsUsed,
}: HasAccessToLiveVideoArgs) => {
  if (Boolean(paymentForShow) || Boolean(recentPaymentsToPayee?.length)) {
    return true;
  }
  if (freePreviewIsUsed !== undefined && !freePreviewIsUsed) {
    return true;
  }
  return false;
};

export default {
  hasAccessToLiveVideo,
};
