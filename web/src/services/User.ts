import { User, UserPermission } from 'types';
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

const isAdmin = (user: User | undefined) => {
  if (!user) return false;

  const { permissions } = user;
  return Object.values(permissions).includes('Admin' as UserPermission);
};

export default {
  hasAccessToLiveVideo,
  isAdmin,
};
