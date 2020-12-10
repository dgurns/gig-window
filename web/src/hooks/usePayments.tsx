import { useEffect } from 'react';
import { useLazyQuery, gql, LazyQueryResult } from '@apollo/client';
import useCurrentUser from 'hooks/useCurrentUser';
import { Payment } from 'types';

const GET_PAYMENTS = gql`
  query GetPayments {
    getUserPayments {
      id
      createdAt
      amountInCents
      isRefunded
      payeeUser {
        username
      }
    }
  }
`;

const GET_PAYMENT_FOR_SHOW = gql`
  query GetUserPaymentForShow($showId: Int!) {
    getUserPaymentForShow(showId: $showId) {
      id
    }
  }
`;

const GET_RECENT_PAYMENTS_TO_PAYEE = gql`
  query GetUserPaymentsToPayee($payeeUserId: Int!) {
    getUserPaymentsToPayee(payeeUserId: $payeeUserId, onlyRecent: true) {
      id
    }
  }
`;

interface PaymentsData {
  getUserPayments: Payment[];
}
interface PaymentForShowData {
  getUserPaymentForShow: Payment;
}
interface RecentPaymentsToPayeeData {
  getUserPaymentsToPayee: Payment[];
}

interface UsePaymentsArgs {
  showId?: number;
  payeeUserId?: number;
}
interface UsePaymentsReturnValue {
  payments?: Payment[];
  paymentsQuery: LazyQueryResult<PaymentsData, {}>;
  paymentForShow?: Payment;
  paymentForShowQuery: LazyQueryResult<PaymentForShowData, {}>;
  recentPaymentsToPayee?: Payment[];
  recentPaymentsToPayeeQuery: LazyQueryResult<RecentPaymentsToPayeeData, {}>;
  refetchPayments: () => void;
}

const usePayments = ({
  showId,
  payeeUserId,
}: UsePaymentsArgs = {}): UsePaymentsReturnValue => {
  const [currentUser] = useCurrentUser();

  const [getPayments, paymentsQuery] = useLazyQuery<PaymentsData>(
    GET_PAYMENTS,
    {
      fetchPolicy: 'cache-and-network',
    }
  );
  useEffect(() => {
    if (currentUser) {
      getPayments();
    }
  }, [getPayments, currentUser]);

  const [getPaymentForShow, paymentForShowQuery] = useLazyQuery<
    PaymentForShowData
  >(GET_PAYMENT_FOR_SHOW, { fetchPolicy: 'cache-and-network' });
  useEffect(() => {
    if (showId && currentUser) {
      getPaymentForShow({ variables: { showId } });
    }
  }, [getPaymentForShow, showId, currentUser]);

  const [getRecentPaymentsToPayee, recentPaymentsToPayeeQuery] = useLazyQuery<
    RecentPaymentsToPayeeData
  >(GET_RECENT_PAYMENTS_TO_PAYEE, { fetchPolicy: 'cache-and-network' });
  useEffect(() => {
    if (payeeUserId && currentUser) {
      getRecentPaymentsToPayee({ variables: { payeeUserId } });
    }
  }, [getRecentPaymentsToPayee, payeeUserId, currentUser]);

  const payments = paymentsQuery.data?.getUserPayments;
  const paymentForShow = paymentForShowQuery.data?.getUserPaymentForShow;
  const recentPaymentsToPayee =
    recentPaymentsToPayeeQuery.data?.getUserPaymentsToPayee;

  const refetchPayments = () => {
    if (!currentUser) {
      return;
    }

    paymentsQuery.refetch && paymentsQuery.refetch();
    if (showId) {
      paymentForShowQuery.refetch && paymentForShowQuery.refetch();
    }
    if (payeeUserId) {
      recentPaymentsToPayeeQuery.refetch &&
        recentPaymentsToPayeeQuery.refetch();
    }
  };

  return {
    payments,
    paymentsQuery,
    paymentForShow,
    paymentForShowQuery,
    recentPaymentsToPayee,
    recentPaymentsToPayeeQuery,
    refetchPayments,
  };
};

export default usePayments;
