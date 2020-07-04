import { useQuery, gql, QueryResult } from '@apollo/client';
import useCurrentUser from 'hooks/useCurrentUser';

export interface Payment {
  id: number;
  createdAt: string;
  amountInCents: number;
  isRefunded: boolean;
  payeeUser: {
    username: string;
  };
}
interface PaymentsData {
  getUserPayments: Payment[];
}

export interface PaymentForShow {
  id: number;
}
interface PaymentForShowData {
  getUserPaymentForShow: PaymentForShow;
}

export interface RecentPaymentToPayee {
  id: number;
}
interface RecentPaymentsToPayeeData {
  getUserPaymentsToPayee: RecentPaymentToPayee[];
}

interface UsePaymentsArgs {
  showId?: number;
  payeeUserId?: number;
}

interface UsePaymentsReturnValue {
  payments?: Payment[];
  paymentsQuery: QueryResult<PaymentsData>;
  paymentForShow?: PaymentForShow;
  paymentForShowQuery: QueryResult<PaymentForShowData>;
  recentPaymentsToPayee?: RecentPaymentToPayee[];
  recentPaymentsToPayeeQuery: QueryResult<RecentPaymentsToPayeeData>;
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

  const paymentsQuery = useQuery<PaymentsData>(GET_PAYMENTS, {
    skip: !currentUser,
    fetchPolicy: 'cache-and-network',
  });
  const paymentForShowQuery = useQuery<PaymentForShowData>(
    GET_PAYMENT_FOR_SHOW,
    {
      variables: { showId },
      skip: !showId || !currentUser,
      fetchPolicy: 'cache-and-network',
    }
  );
  const recentPaymentsToPayeeQuery = useQuery<RecentPaymentsToPayeeData>(
    GET_RECENT_PAYMENTS_TO_PAYEE,
    {
      variables: { payeeUserId },
      skip: !payeeUserId || !currentUser,
      fetchPolicy: 'cache-and-network',
    }
  );

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
