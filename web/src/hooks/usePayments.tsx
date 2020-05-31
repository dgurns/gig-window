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
  paymentsToPayee: Payment[] | undefined;
  paymentsToPayeeQuery: QueryResult<Payment>;
  refetchPayments: () => void;
}

const GET_PAYMENT_FOR_SHOW = gql`
  query GetUserPaymentForShow($showId: Int!) {
    getUserPaymentForShow(showId: $showId) {
      id
    }
  }
`;

const GET_PAYMENTS_TO_PAYEE = gql`
  query GetUserPaymentsToPayee($payeeUserId: Int!) {
    getUserPaymentsToPayee(payeeUserId: $payeeUserId) {
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
  const paymentsToPayeeQuery = useQuery(GET_PAYMENTS_TO_PAYEE, {
    variables: { payeeUserId },
    skip: !payeeUserId || !currentUser,
  });

  const paymentForShow = paymentForShowQuery.data?.getUserPaymentForShow;
  const paymentsToPayee = paymentsToPayeeQuery.data?.getUserPaymentsToPayee;

  const refetchPayments = () => {
    paymentForShowQuery.refetch();
    paymentsToPayeeQuery.refetch();
  };

  return {
    paymentForShow,
    paymentForShowQuery,
    paymentsToPayee,
    paymentsToPayeeQuery,
    refetchPayments,
  };
};

export default usePayments;
