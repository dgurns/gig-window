import { User, UserPermission } from 'types';
import { PaymentForShow, RecentPaymentToPayee } from 'hooks/usePayments';

interface HasAccessToLiveVideoArgs {
  user?: User;
  paymentForShow?: PaymentForShow;
  recentPaymentsToPayee?: RecentPaymentToPayee[];
}

const hasAccessToLiveVideo = ({
  user,
  paymentForShow,
  recentPaymentsToPayee,
}: HasAccessToLiveVideoArgs) => {
  if (
    Boolean(isAdmin(user)) ||
    Boolean(paymentForShow) ||
    Boolean(recentPaymentsToPayee?.length)
  ) {
    return true;
  }
  return false;
};

const isAdmin = (user: User | undefined) => {
  if (!user) return false;

  const { permissions } = user;
  return Object.values(permissions).includes('Admin' as UserPermission);
};

const UserService = {
  hasAccessToLiveVideo,
  isAdmin,
};
export default UserService;
