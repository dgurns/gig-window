import React, { useEffect, useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import TextButton from './TextButton';

const CREATE_PAYMENT = gql`
  mutation CreatePayment(
    $amountInCents: Int!
    $payeeUserId: Int!
    $showId: Int
  ) {
    createPayment(
      data: {
        amountInCents: $amountInCents
        payeeUserId: $payeeUserId
        showId: $showId
      }
    ) {
      id
    }
  }
`;

const DELETE_CARD = gql`
  mutation DeleteCard($paymentMethodId: String!) {
    detachPaymentMethodFromUser(paymentMethodId: $paymentMethodId) {
      id
    }
  }
`;

const useStyles = makeStyles(({ spacing }) => ({
  savedCardWrapper: {
    margin: `${spacing(2)}px 0`,
  },
  error: {
    marginBottom: spacing(3),
    textAlign: 'center',
  },
  hiddenField: {
    height: 0,
    width: 0,
  },
  submitButton: {
    width: '100%',
  },
}));

interface PayWithSavedCardProps {
  paymentMethod: {
    id: string;
    card: {
      brand: string;
      last4: string;
    };
  };
  payeeUserId: number;
  showId?: number;
  paymentAmountInCents?: number;
  onSuccess: () => void;
  onDeleteCard: () => void;
}

const PayWithSavedCard = (props: PayWithSavedCardProps) => {
  const {
    paymentMethod,
    payeeUserId,
    showId,
    paymentAmountInCents,
    onSuccess,
    onDeleteCard,
  } = props;

  const classes = useStyles();

  const [paymentError, setPaymentError] = useState('');
  const [deleteCardError, setDeleteCardError] = useState('');

  const [createPayment, createPaymentMutation] = useMutation(CREATE_PAYMENT, {
    errorPolicy: 'all',
  });
  const [deleteCard, deleteCardMutation] = useMutation(DELETE_CARD, {
    errorPolicy: 'all',
  });

  useEffect(() => {
    if (createPaymentMutation.data?.createPayment) {
      onSuccess();
    } else if (createPaymentMutation.error) {
      setPaymentError(
        'Could not process payment. Please try again or use a different card.'
      );
    }
  }, [createPaymentMutation.data, createPaymentMutation.error, onSuccess]);

  useEffect(() => {
    if (deleteCardMutation.data?.detachPaymentMethodFromUser) {
      onDeleteCard();
    } else if (deleteCardMutation.error) {
      setDeleteCardError('Error deleting card. Please try again.');
    }
  }, [deleteCardMutation.data, deleteCardMutation.error, onDeleteCard]);

  const onSubmitPayment = async (event: React.FormEvent) => {
    event.preventDefault();
    setPaymentError('');
    createPayment({
      variables: {
        amountInCents: paymentAmountInCents,
        payeeUserId,
        showId,
      },
    });
  };

  const shouldDisableButton =
    !paymentAmountInCents ||
    createPaymentMutation.loading ||
    deleteCardMutation.loading;

  let buttonLabel;
  if (!paymentAmountInCents) {
    buttonLabel = 'No amount entered';
  } else if (createPaymentMutation.loading) {
    buttonLabel = 'Submitting...';
  } else if (deleteCardMutation.loading) {
    buttonLabel = 'Deleting card...';
  } else if (paymentAmountInCents) {
    buttonLabel = `Pay $${paymentAmountInCents / 100}`;
  }

  const { id, card } = paymentMethod;

  return (
    <Grid container direction="column">
      <form onSubmit={onSubmitPayment}>
        <Grid
          item
          container
          direction="row"
          justify="space-between"
          className={classes.savedCardWrapper}
        >
          <Typography>
            {card.brand.toUpperCase()} ending in {card.last4}
          </Typography>
          <TextButton
            onClick={() => deleteCard({ variables: { paymentMethodId: id } })}
            disabled={deleteCardMutation.loading}
          >
            delete
          </TextButton>
        </Grid>

        {paymentError && (
          <Typography variant="body2" color="error" className={classes.error}>
            {paymentError}
          </Typography>
        )}
        {deleteCardError && (
          <Typography variant="body2" color="error" className={classes.error}>
            {deleteCardError}
          </Typography>
        )}

        <TextField autoFocus className={classes.hiddenField} />
        <Button
          variant="contained"
          color="primary"
          size="medium"
          type="submit"
          disabled={shouldDisableButton}
          className={classes.submitButton}
        >
          {buttonLabel}
        </Button>
      </form>
    </Grid>
  );
};

export default PayWithSavedCard;
