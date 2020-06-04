import { useQuery, gql, QueryResult } from '@apollo/client';
import useCurrentUser from 'hooks/useCurrentUser';

interface Payment {
  id: number;
  createdAt: string;
  amountInCents: number;
  isRefunded: boolean;
  payeeUser: {
    username: string;
  };
}

interface PaymentForShow {
  id: number;
}

interface RecentPaymentToPayee {
  id: number;
}

interface UsePaymentsArgs {
  showId?: number;
  payeeUserId?: number;
}

interface UsePaymentsReturnValue {
  payments: Payment[] | undefined;
  paymentsQuery: QueryResult<Payment>;
  paymentForShow: PaymentForShow | undefined;
  paymentForShowQuery: QueryResult<PaymentForShow>;
  recentPaymentsToPayee: RecentPaymentToPayee[] | undefined;
  recentPaymentsToPayeeQuery: QueryResult<RecentPaymentToPayee>;
  refetchPayments: () => void;
}

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

const usePayments = ({
  showId,
  payeeUserId,
}: UsePaymentsArgs = {}): UsePaymentsReturnValue => {
  const [currentUser] = useCurrentUser();

  const paymentsQuery = useQuery(GET_PAYMENTS, {
    skip: !currentUser,
  });
  const paymentForShowQuery = useQuery(GET_PAYMENT_FOR_SHOW, {
    variables: { showId },
    skip: !showId || !currentUser,
    fetchPolicy: 'cache-and-network',
  });
  const recentPaymentsToPayeeQuery = useQuery(GET_RECENT_PAYMENTS_TO_PAYEE, {
    variables: { payeeUserId },
    skip: !payeeUserId || !currentUser,
    fetchPolicy: 'cache-and-network',
  });

  const payments = paymentsQuery.data?.getUserPayments;
  const paymentForShow = paymentForShowQuery.data?.getUserPaymentForShow;
  const recentPaymentsToPayee =
    recentPaymentsToPayeeQuery.data?.getUserPaymentsToPayee;

  const refetchPayments = () => {
    if (!currentUser) return;

    paymentsQuery.refetch();
    if (showId) paymentForShowQuery.refetch();
    if (payeeUserId) recentPaymentsToPayeeQuery.refetch();
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
