import React, { useState } from 'react';
import debounce from 'lodash/debounce';
import { useQuery, gql } from '@apollo/client';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Grid, Typography, Divider, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';

import MoneyInputField from './MoneyInputField';
import AuthForm from './AuthForm';
import PayWithCard from './PayWithCard';
import PayWithSavedCard from './PayWithSavedCard';

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || ''
);

const GET_SAVED_PAYMENT_METHOD = gql`
  query {
    getLatestPaymentMethodForUser {
      id
      card
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
  payeeUserId: number;
  payeeUsername: string;
  prefilledPaymentAmount?: string;
}

const PaymentForm = (props: PaymentFormProps) => {
  const { payeeUserId, payeeUsername, prefilledPaymentAmount } = props;
  const classes = useStyles();

  const [currentUser, currentUserQuery] = useCurrentUser();
  const [paymentAmount, setPaymentAmount] = useState(prefilledPaymentAmount);

  const savedPaymentMethodQuery = useQuery(GET_SAVED_PAYMENT_METHOD, {
    skip: !currentUser,
  });
  const savedPaymentMethod =
    savedPaymentMethodQuery.data?.getLatestPaymentMethodForUser;

  const onAuthSuccess = () => {
    currentUserQuery.refetch();
  };

  const onChangePaymentAmount = debounce((value: string) => {
    if (value === '') {
      return setPaymentAmount(value);
    } else if (typeof parseInt(value) === 'number') {
      return setPaymentAmount(`${parseInt(value)}`);
    }
  }, 400);

  const renderAuthOrPaymentForm = () => {
    if (currentUserQuery.loading || savedPaymentMethodQuery.loading) {
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
      return savedPaymentMethod.card ? (
        <PayWithSavedCard
          savedCard={savedPaymentMethod.card}
          paymentAmountInCents={paymentAmountInCents}
          payeeUserId={payeeUserId}
          onSuccess={() => console.log('Pay with saved card succeeeded')}
        />
      ) : (
        <Elements stripe={stripePromise}>
          <PayWithCard
            paymentAmountInCents={paymentAmountInCents}
            payeeUserId={payeeUserId}
            onSuccess={() => console.log('Pay with card succeeeded')}
          />
        </Elements>
      );
    }
  };

  return (
    <Grid container direction="column">
      <Typography variant="h4" className={classes.title}>
        {prefilledPaymentAmount
          ? `Tip $${prefilledPaymentAmount} to ${payeeUsername}`
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
        80% goes to {payeeUsername}, 20% to the platform after payment
        processing fees
      </Typography>
      <Divider color="secondary" className={classes.divider} />
      {renderAuthOrPaymentForm()}
    </Grid>
  );
};

export default PaymentForm;
