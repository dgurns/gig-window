import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

interface PayWithCardProps {
  payeeUserId: number;
  paymentAmount: number;
  onSuccess: () => void;
}

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

const PayWithCard = (props: PayWithCardProps) => {
  const classes = useStyles();
  const stripe = useStripe();
  const elements = useElements();

  // Make call to create PaymentIntent

  const onSubmit = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Use PaymentIntent secret to confirm payment
  };

  return (
    <Grid container direction="column">
      <Grid className={classes.cardElementWrapper}>
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </Grid>
      <Button
        variant="contained"
        color="primary"
        size="medium"
        onClick={onSubmit}
        disabled={!stripe}
      >
        Pay ${props.paymentAmount}
      </Button>
    </Grid>
  );
};

export default PayWithCard;
