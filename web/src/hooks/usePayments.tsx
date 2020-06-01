import { useQuery, gql, QueryResult } from '@apollo/client';
import useCurrentUser from 'hooks/useCurrentUser';

interface Payment {
  id: number;
}

interface UsePaymentsArgs {
  showId?: number;
  payeeUserId?: number;
}

interface UsePaymentsReturnValue {
  paymentForShow: Payment | undefined;
  paymentForShowQuery: QueryResult<Payment>;
  recentPaymentsToPayee: Payment[] | undefined;
  recentPaymentsToPayeeQuery: QueryResult<Payment>;
  refetchPayments: () => void;
}

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
}: UsePaymentsArgs): UsePaymentsReturnValue => {
  const [currentUser] = useCurrentUser();

  const paymentForShowQuery = useQuery(GET_PAYMENT_FOR_SHOW, {
    variables: { showId },
    skip: !showId || !currentUser,
  });
  const recentPaymentsToPayeeQuery = useQuery(GET_RECENT_PAYMENTS_TO_PAYEE, {
    variables: { payeeUserId },
    skip: !payeeUserId || !currentUser,
  });

  const paymentForShow = paymentForShowQuery.data?.getUserPaymentForShow;
  const recentPaymentsToPayee =
    recentPaymentsToPayeeQuery.data?.getUserPaymentsToPayee;

  const refetchPayments = () => {
    paymentForShowQuery.refetch();
    recentPaymentsToPayeeQuery.refetch();
  };

  return {
    paymentForShow,
    paymentForShowQuery,
    recentPaymentsToPayee,
    recentPaymentsToPayeeQuery,
    refetchPayments,
  };
};

export default usePayments;
