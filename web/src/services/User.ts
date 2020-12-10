import { User, UserPermission, Payment } from 'types';

interface HasAccessToLiveVideoArgs {
  user?: User;
  paymentForShow?: Payment;
  recentPaymentsToPayee?: Payment[];
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
