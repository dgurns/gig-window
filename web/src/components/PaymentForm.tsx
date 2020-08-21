import React, { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { useQuery, gql } from '@apollo/client';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Grid, Typography, Divider, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';
import usePayments from 'hooks/usePayments';

import MoneyInputField from './MoneyInputField';
import AuthForm from './AuthForm';
import PayWithCard from './PayWithCard';
import PayWithSavedCard from './PayWithSavedCard';

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ?? ''
);

const GET_SAVED_PAYMENT_METHOD = gql`
  query {
    getLatestPaymentMethodForUser {
      id
      card {
        brand
        last4
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(1),
  },
  moneyInput: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  moneyInputField: {
    marginRight: theme.spacing(1),
    width: 80,
  },
  divider: {
    margin: `${theme.spacing(2)}px 0 10px`,
  },
  loading: {
    alignSelf: 'center',
    marginTop: theme.spacing(1),
  },
}));

interface PaymentFormProps {
  payee: {
    id: number;
    username: string;
  };
  show?: {
    id: number;
  };
  prefilledPaymentAmount?: string;
  onSuccess?: () => void;
}

const PaymentForm = (props: PaymentFormProps) => {
  const { payee, show, prefilledPaymentAmount, onSuccess } = props;
  const classes = useStyles();

  const [
    currentUser,
    { loading: currentUserLoading, refetch: refetchCurrentUser },
  ] = useCurrentUser();
  const { refetchPayments } = usePayments({
    showId: show?.id,
    payeeUserId: payee.id,
  });
  const [paymentAmount, setPaymentAmount] = useState(prefilledPaymentAmount);

  const savedPaymentMethodQuery = useQuery(GET_SAVED_PAYMENT_METHOD, {
    fetchPolicy: 'no-cache',
    skip: !currentUser,
  });
  const savedPaymentMethod =
    savedPaymentMethodQuery.data?.getLatestPaymentMethodForUser;

  const onAuthSuccess = useCallback(() => {
    refetchCurrentUser();
  }, [refetchCurrentUser]);

  const onPaymentSuccess = useCallback(async () => {
    await refetchPayments();
    if (onSuccess) {
      onSuccess();
    }
  }, [refetchPayments, onSuccess]);

  const onChangePaymentAmount = debounce((value: string) => {
    if (value === '' || value === '0') {
      return setPaymentAmount('');
    } else if (typeof parseInt(value) === 'number') {
      const absolutePaymentAmount = Math.abs(parseInt(value));
      return setPaymentAmount(absolutePaymentAmount.toString());
    }
  }, 400);

  const renderAuthOrPaymentForm = () => {
    if (currentUserLoading || savedPaymentMethodQuery.loading) {
      return <CircularProgress color="secondary" className={classes.loading} />;
    } else if (!currentUser) {
      return (
        <AuthForm
          hideTitle={true}
          customSubmitLabel="Next"
          onSuccess={onAuthSuccess}
        />
      );
    } else if (!paymentAmount) {
      return null;
    } else {
      const paymentAmountInCents = parseInt(paymentAmount) * 100;
      return savedPaymentMethod?.card ? (
        <PayWithSavedCard
          paymentMethod={savedPaymentMethod}
          paymentAmountInCents={paymentAmountInCents}
          payeeUserId={payee.id}
          showId={show?.id}
          onSuccess={onPaymentSuccess}
          onDeleteCard={savedPaymentMethodQuery.refetch}
        />
      ) : (
        <Elements stripe={stripePromise}>
          <PayWithCard
            paymentAmountInCents={paymentAmountInCents}
            payeeUserId={payee.id}
            showId={show?.id}
            onSuccess={onPaymentSuccess}
          />
        </Elements>
      );
    }
  };

  return (
    <Grid container direction="column">
      <Typography variant="h4" className={classes.title}>
        {prefilledPaymentAmount
          ? `Tip $${prefilledPaymentAmount} to ${payee.username}`
          : 'Name your price'}
      </Typography>
      {!prefilledPaymentAmount && (
        <Grid
          item
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-end"
          className={classes.moneyInput}
        >
          <MoneyInputField
            autoFocus={true}
            className={classes.moneyInputField}
            defaultValue={prefilledPaymentAmount}
            onChange={(event) => onChangePaymentAmount(event.target.value)}
          />
          <Typography variant="body2" color="secondary">
            ($1 or more)
          </Typography>
        </Grid>
      )}
      <Typography color="secondary">
        80% goes to {payee.username}, 20% to the platform after payment
        processing fees
      </Typography>
      <Divider color="secondary" className={classes.divider} />
      {renderAuthOrPaymentForm()}
    </Grid>
  );
};

export default PaymentForm;
