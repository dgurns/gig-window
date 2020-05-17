import React, { useEffect, useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import TextButton from './TextButton';

interface PayWithSavedCardProps {
  savedCard: {
    brand: string;
    last4: string;
  };
  payeeUserId: number;
  paymentAmountInCents?: number;
  onSuccess: () => void;
}

const CREATE_PAYMENT = gql`
  mutation CreatePayment($amountInCents: Int!, $payeeUserId: Int!) {
    createPayment(
      data: { amountInCents: $amountInCents, payeeUserId: $payeeUserId }
    )
  }
`;

const DETACH_CARD = gql``;

const useStyles = makeStyles(({ spacing }) => ({
  savedCardWrapper: {
    margin: `${spacing(2)}px 0`,
  },
  error: {
    marginBottom: spacing(3),
    textAlign: 'center',
  },
}));

const PayWithSavedCard = (props: PayWithSavedCardProps) => {
  const { savedCard, payeeUserId, paymentAmountInCents, onSuccess } = props;

  const classes = useStyles();

  const [paymentIsSubmitting, setPaymentIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const [createPayment, payment] = useMutation(CREATE_PAYMENT, {
    errorPolicy: 'all',
  });

  useEffect(() => {
    if (payment.data?.createPayment) {
      onSuccess();
    } else if (payment.error) {
      setPaymentIsSubmitting(false);
      setPaymentError('Could not process payment. Please try again.');
    }
  }, [payment.data, payment.error, onSuccess]);

  const onSubmit = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setPaymentIsSubmitting(true);
    setPaymentError('');

    createPayment({
      variables: {
        amountInCents: paymentAmountInCents,
        payeeUserId,
      },
    });
  };

  const shouldDisableButton = !paymentAmountInCents || paymentIsSubmitting;

  let buttonLabel;
  if (!paymentAmountInCents) {
    buttonLabel = 'No amount entered';
  } else if (paymentIsSubmitting) {
    buttonLabel = 'Submitting...';
  } else if (paymentAmountInCents) {
    buttonLabel = `Pay $${paymentAmountInCents / 100}`;
  }

  return (
    <Grid container direction="column">
      <Grid
        item
        container
        direction="row"
        justify="space-between"
        className={classes.savedCardWrapper}
      >
        <Typography>
          Use {savedCard.brand} ending in {savedCard.last4}
        </Typography>
        <TextButton>delete</TextButton>
      </Grid>

      {paymentError && (
        <Typography variant="body2" color="error" className={classes.error}>
          {paymentError}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        size="medium"
        onClick={onSubmit}
        disabled={shouldDisableButton}
      >
        {buttonLabel}
      </Button>
    </Grid>
  );
};

export default PayWithSavedCard;
