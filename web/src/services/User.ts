import { PaymentForShow, RecentPaymentToPayee } from 'hooks/usePayments';

interface HasAccessToLiveVideoArgs {
  paymentForShow?: PaymentForShow;
  recentPaymentsToPayee?: RecentPaymentToPayee[];
}

const hasAccessToLiveVideo = ({
  paymentForShow,
  recentPaymentsToPayee,
}: HasAccessToLiveVideoArgs) => {
  if (Boolean(paymentForShow) || Boolean(recentPaymentsToPayee?.length)) {
    return true;
  }
  return false;
};

export default {
  hasAccessToLiveVideo,
};
