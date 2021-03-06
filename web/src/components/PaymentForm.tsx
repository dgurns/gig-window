import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Grid, Typography, Divider, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';
import usePayments from 'hooks/usePayments';
import { User, Show } from 'types';

import MoneyInputField from './MoneyInputField';
import AuthForm from './AuthForm';
import PayWithPaymentRequest from './PayWithPaymentRequest';
import PayWithCard from './PayWithCard';
import PayWithSavedCard from './PayWithSavedCard';

const stripePromiseAsPlatform = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ?? '',
  {
    apiVersion: '2020-08-27',
  }
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

const CREATE_STRIPE_SETUP_INTENT = gql`
  mutation CreateStripeSetupIntent {
    createStripeSetupIntent {
      client_secret
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
  payee: User;
  show?: Show;
  prefilledPaymentAmount?: string;
  onSuccess?: () => void;
}

const PaymentForm = (props: PaymentFormProps) => {
  const { payee, show, prefilledPaymentAmount, onSuccess } = props;
  const classes = useStyles();

  const minPriceInCents = show?.minPriceInCents ?? 100;
  const minPriceAsString = `${minPriceInCents / 100}`;

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

  const [createStripeSetupIntent, setupIntent] = useMutation(
    CREATE_STRIPE_SETUP_INTENT,
    {
      errorPolicy: 'all',
    }
  );
  useEffect(() => {
    if (currentUser) {
      createStripeSetupIntent();
    }
  }, [createStripeSetupIntent, currentUser]);
  const setupIntentClientSecret =
    setupIntent.data?.createStripeSetupIntent.client_secret;

  const onAuthSuccess = useCallback(() => {
    refetchCurrentUser && refetchCurrentUser();
  }, [refetchCurrentUser]);

  const onPaymentSuccess = useCallback(async () => {
    await refetchPayments();
    if (onSuccess) {
      onSuccess();
    }
  }, [refetchPayments, onSuccess]);

  const onChangePaymentAmount = debounce((value: string) => {
    const valueAsInt = parseInt(value);
    if (value === '' || value === '0' || isNaN(valueAsInt)) {
      return setPaymentAmount('');
    }
    const absolutePaymentAmount = Math.abs(valueAsInt);
    return setPaymentAmount(absolutePaymentAmount.toString());
  }, 400);

  const renderAuthOrPaymentForm = () => {
    const paymentAmountIsValid =
      prefilledPaymentAmount ||
      parseInt(paymentAmount ?? '0') * 100 >= minPriceInCents;

    if (
      currentUserLoading ||
      savedPaymentMethodQuery.loading ||
      setupIntent.loading
    ) {
      return <CircularProgress color="secondary" className={classes.loading} />;
    } else if (!currentUser) {
      return (
        <AuthForm
          hideTitle={true}
          customSubmitLabel="Next"
          onSuccess={onAuthSuccess}
        />
      );
    } else if (!paymentAmount || !paymentAmountIsValid) {
      return null;
    } else if (savedPaymentMethod?.card) {
      const paymentAmountInCents = parseInt(paymentAmount) * 100;
      return (
        <PayWithSavedCard
          paymentMethod={savedPaymentMethod}
          paymentAmountInCents={paymentAmountInCents}
          payeeUserId={payee.id}
          showId={show?.id}
          onSuccess={onPaymentSuccess}
          onDeleteCard={savedPaymentMethodQuery.refetch}
        />
      );
    } else if (setupIntent.error || !setupIntentClientSecret) {
      return (
        <Typography color="error">
          Error initializing payment form. Please reload.
        </Typography>
      );
    } else {
      const paymentAmountInCents = parseInt(paymentAmount) * 100;
      return (
        <Elements stripe={stripePromiseAsPlatform}>
          <PayWithPaymentRequest
            paymentAmountInCents={paymentAmountInCents}
            payee={payee}
            showId={show?.id}
            onSuccess={onPaymentSuccess}
            setupIntentClientSecret={setupIntentClientSecret}
          />
          <PayWithCard
            paymentAmountInCents={paymentAmountInCents}
            payeeUserId={payee.id}
            showId={show?.id}
            onSuccess={onPaymentSuccess}
            setupIntentClientSecret={setupIntentClientSecret}
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
          alignItems="center"
          className={classes.moneyInput}
        >
          <MoneyInputField
            autoFocus={true}
            className={classes.moneyInputField}
            defaultValue={prefilledPaymentAmount}
            onChange={(event) => onChangePaymentAmount(event.target.value)}
          />
          <Typography>(${minPriceAsString} or more)</Typography>
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
