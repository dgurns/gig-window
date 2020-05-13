import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { useMutation, gql } from '@apollo/client';
import Stripe from '@stripe/stripe-js';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

interface PayWithCardProps {
  payeeUserId: number;
  paymentAmountInCents?: number;
  onSuccess: () => void;
}

const CREATE_SETUP_INTENT = gql`
  mutation CreateSetupIntent {
    createSetupIntent {
      client_secret
    }
  }
`;

const useStyles = makeStyles(({ palette, spacing }) => ({
  cardElementWrapper: {
    border: `1px solid ${palette.secondary.main}`,
    borderRadius: spacing(1),
    margin: `${spacing(2)}px 0 ${spacing(1)}px`,
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
  saveCard: {
    color: palette.secondary.main,
    marginBottom: spacing(2),
    opacity: 0,
  },
  saveCardVisible: {
    opacity: 1,
  },
  error: {
    marginBottom: spacing(3),
    textAlign: 'center',
  },
}));

const cardElementOptions = {
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
  const { payeeUserId, paymentAmountInCents, onSuccess } = props;

  const classes = useStyles();
  const stripe = useStripe();
  const elements = useElements();

  const [shouldSaveCard, setShouldSaveCard] = useState(true);
  const [cardElementIsReady, setCardElementIsReady] = useState(false);
  const [paymentIsSubmitting, setPaymentIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const [createSetupIntent, setupIntent] = useMutation(CREATE_SETUP_INTENT, {
    errorPolicy: 'all',
  });
  const setupIntentClientSecret =
    setupIntent.data?.createSetupIntent.client_secret;

  useEffect(() => {
    createSetupIntent();
  }, [createSetupIntent]);

  const onSubmit = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    setPaymentIsSubmitting(true);
    setPaymentError('');

    const result = await stripe.confirmCardSetup(setupIntentClientSecret, {
      payment_method: {
        card,
      },
    });

    if (result.error) {
      setPaymentError(
        result.error.message ||
          'Error confirming payment. Please check your card details'
      );
    } else {
      if (result.setupIntent?.status === 'succeeded') {
        console.log('setupIntent succeeded', setupIntent);
        // Create payment on server
        // Call onSuccess
      }
    }

    setPaymentIsSubmitting(false);
  };

  if (setupIntent.error) {
    return (
      <Typography color="secondary">
        Error initializing payment form. Please reload.
      </Typography>
    );
  }

  const shouldDisableButton =
    setupIntent.loading ||
    !cardElementIsReady ||
    !paymentAmountInCents ||
    !setupIntentClientSecret ||
    paymentIsSubmitting;

  let buttonLabel;
  if (!paymentAmountInCents) {
    buttonLabel = 'No amount entered';
  } else if (setupIntent.loading || !cardElementIsReady) {
    buttonLabel = 'Loading...';
  } else if (paymentIsSubmitting) {
    buttonLabel = 'Submitting...';
  } else if (paymentAmountInCents) {
    buttonLabel = `Pay $${paymentAmountInCents / 100}`;
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
          options={cardElementOptions}
          onReady={() => setCardElementIsReady(true)}
        />
      </Grid>

      <FormControlLabel
        label="Use this card for future payments"
        control={
          <Checkbox
            checked={shouldSaveCard}
            onChange={() => setShouldSaveCard(!shouldSaveCard)}
            color="primary"
          />
        }
        className={classnames([
          classes.saveCard,
          {
            [classes.saveCardVisible]: cardElementIsReady,
          },
        ])}
      />

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

export default PayWithCard;
