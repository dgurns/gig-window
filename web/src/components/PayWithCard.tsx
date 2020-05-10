import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { useMutation, gql } from '@apollo/client';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const CREATE_PAYMENT_INTENT = gql`
  mutation CreatePaymentIntent($amountInCents: Int!, $payeeUserId: Int!) {
    createPaymentIntent(
      data: { amountInCents: $amountInCents, payeeUserId: $payeeUserId }
    )
  }
`;

const useStyles = makeStyles(({ palette, spacing }) => ({
  cardElementWrapper: {
    border: `1px solid ${palette.secondary.main}`,
    borderRadius: spacing(1),
    margin: `${spacing(2)}px 0 ${spacing(3)}px`,
    padding: 13,
    paddingBottom: 12,
    position: 'relative',
    '&:hover': {
      border: `1px solid ${palette.common.black}`,
    },
  },
  cardElementLoading: {
    left: 13,
    position: 'absolute',
    top: 13,
  },
  cardElementLoadingHidden: {
    display: 'none',
  },
  error: {
    marginBottom: spacing(3),
    textAlign: 'center',
  },
}));

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#212121',
      fontFamily: '"Lato", sans-serif',
      fontSize: '15px',
      '::placeholder': {
        color: '#9e9e9e',
      },
    },
  },
};

interface PayWithCardProps {
  payeeUserId: number;
  paymentAmountInCents: number;
  onSuccess: () => void;
}

const PayWithCard = (props: PayWithCardProps) => {
  const { payeeUserId, paymentAmountInCents, onSuccess } = props;

  const classes = useStyles();
  const stripe = useStripe();
  const elements = useElements();

  const [cardElementIsReady, setCardElementIsReady] = useState(false);
  const [paymentIsSubmitting, setPaymentIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const [createPaymentIntent, paymentIntent] = useMutation(
    CREATE_PAYMENT_INTENT,
    {
      errorPolicy: 'all',
    }
  );
  const clientSecret = paymentIntent.data?.createPaymentIntent;

  useEffect(() => {
    createPaymentIntent({
      variables: {
        amountInCents: paymentAmountInCents,
        payeeUserId,
      },
    });
  }, [paymentAmountInCents, payeeUserId, createPaymentIntent]);

  const onSubmitPayment = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      return;
    }

    setPaymentIsSubmitting(true);
    setPaymentError('');
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
      },
    });
    setPaymentIsSubmitting(false);

    if (result.error) {
      setPaymentError(
        result.error.message ||
          'Error confirming payment. Please check your card details'
      );
    } else {
      if (result.paymentIntent?.status === 'succeeded') {
        onSuccess();
      }
    }
  };

  if (paymentIntent.loading || !stripe || !elements) {
    return <Typography color="secondary">Loading...</Typography>;
  } else if (paymentIntent.error) {
    return (
      <Typography color="secondary">
        Error initializing payment form. Please reload.
      </Typography>
    );
  }

  return (
    <Grid container direction="column">
      <Grid className={classes.cardElementWrapper}>
        <CircularProgress
          className={classnames(classes.cardElementLoading, {
            [classes.cardElementLoadingHidden]: cardElementIsReady,
          })}
          size={18}
          color="secondary"
        />
        <CardElement
          options={CARD_ELEMENT_OPTIONS}
          onReady={() => setCardElementIsReady(true)}
        />
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
        onClick={onSubmitPayment}
        disabled={!stripe || paymentIntent.loading || paymentIsSubmitting}
      >
        Pay ${props.paymentAmountInCents / 100}
      </Button>
    </Grid>
  );
};

export default PayWithCard;
