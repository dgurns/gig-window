import React, { useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
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
    '&:hover': {
      border: `1px solid ${palette.common.black}`,
    },
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

  const [createPaymentIntent, { loading, data, error }] = useMutation(
    CREATE_PAYMENT_INTENT,
    {
      errorPolicy: 'all',
    }
  );
  const clientSecret = data?.createPaymentIntent;

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

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        // Add save_payment_method and setup_future_usage here if applicable
      },
    });

    if (result.error) {
      alert('Error confirming payment');
    } else {
      if (result.paymentIntent?.status === 'succeeded') {
        onSuccess();
        alert('Payment succeeded');
      }
    }
  };

  if (loading) {
    return <Typography color="secondary">Loading...</Typography>;
  } else if (error) {
    return (
      <Typography color="secondary">
        Error initializing payment form. Please reload.
      </Typography>
    );
  }

  return (
    <Grid container direction="column">
      <Grid className={classes.cardElementWrapper}>
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </Grid>
      <Button
        variant="contained"
        color="primary"
        size="medium"
        onClick={onSubmitPayment}
        disabled={!stripe || loading}
      >
        Pay ${props.paymentAmountInCents}
      </Button>
    </Grid>
  );
};

export default PayWithCard;
