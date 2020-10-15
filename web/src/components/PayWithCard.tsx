import React, { useEffect, useState, useCallback } from "react";
import classnames from "classnames";
import { useMutation, gql } from "@apollo/client";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const CHARGE_CARD_AS_PAYEE = gql`
  mutation ChargeCardAsPayee(
    $amountInCents: Int!
    $payeeUserId: Int!
    $showId: Int
    $shouldDetachPaymentMethodAfter: Boolean!
  ) {
    chargeCardAsPayee(
      data: {
        amountInCents: $amountInCents
        payeeUserId: $payeeUserId
        showId: $showId
        shouldDetachPaymentMethodAfter: $shouldDetachPaymentMethodAfter
      }
    ) {
      id
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
    position: "relative",
    "&:hover": {
      border: `1px solid ${palette.common.black}`,
    },
  },
  cardElementLoading: {
    left: 13,
    position: "absolute",
    top: 13,
  },
  cardElementLoadingHidden: {
    display: "none",
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
    textAlign: "center",
  },
  submitButton: {
    width: "100%",
  },
}));

const cardElementOptions = {
  style: {
    base: {
      color: "#212121",
      fontFamily: '"Lato", sans-serif',
      fontSize: "15px",
      "::placeholder": {
        color: "#9e9e9e",
      },
    },
  },
};

interface PayWithCardProps {
  payeeUserId: number;
  showId?: number;
  paymentAmountInCents?: number;
  onSuccess: () => void;
  setupIntentClientSecret: string;
}

const PayWithCard = (props: PayWithCardProps) => {
  const {
    payeeUserId,
    showId,
    paymentAmountInCents,
    onSuccess,
    setupIntentClientSecret,
  } = props;

  const classes = useStyles();
  const stripe = useStripe();
  const elements = useElements();

  const [shouldSaveCard, setShouldSaveCard] = useState(true);
  const [cardElementIsReady, setCardElementIsReady] = useState(false);
  const [paymentIsSubmitting, setPaymentIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const [chargeCardAsPayee, payment] = useMutation(CHARGE_CARD_AS_PAYEE, {
    errorPolicy: "all",
  });

  useEffect(() => {
    if (payment.data?.chargeCardAsPayee) {
      onSuccess();
    } else if (payment.error) {
      setPaymentIsSubmitting(false);
      setPaymentError("Could not process payment. Please try again.");
    }
  }, [payment.data, payment.error, onSuccess]);

  const onSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!stripe || !elements) return;

      const card = elements.getElement(CardElement);
      if (!card) return;

      setPaymentIsSubmitting(true);
      setPaymentError("");

      const result = await stripe.confirmCardSetup(setupIntentClientSecret, {
        payment_method: {
          card,
        },
      });

      if (result.error) {
        setPaymentError(
          result.error.message ||
            "Error confirming payment. Please check your card details"
        );
        setPaymentIsSubmitting(false);
      } else {
        if (result.setupIntent?.status === "succeeded") {
          chargeCardAsPayee({
            variables: {
              amountInCents: paymentAmountInCents,
              payeeUserId,
              showId,
              shouldDetachPaymentMethodAfter: !shouldSaveCard,
            },
          });
        }
      }
    },
    [
      stripe,
      elements,
      chargeCardAsPayee,
      payeeUserId,
      paymentAmountInCents,
      setupIntentClientSecret,
      shouldSaveCard,
      showId,
    ]
  );

  const shouldDisableButton =
    !cardElementIsReady ||
    !paymentAmountInCents ||
    !setupIntentClientSecret ||
    paymentIsSubmitting;

  let buttonLabel;
  if (!paymentAmountInCents) {
    buttonLabel = "No amount entered";
  } else if (!cardElementIsReady) {
    buttonLabel = "Loading...";
  } else if (paymentIsSubmitting) {
    buttonLabel = "Submitting...";
  } else if (paymentAmountInCents) {
    buttonLabel = `Pay $${paymentAmountInCents / 100}`;
  }

  return (
    <Grid container direction="column">
      <form onSubmit={onSubmit}>
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
          disabled={shouldDisableButton}
          type="submit"
          className={classes.submitButton}
        >
          {buttonLabel}
        </Button>
      </form>
    </Grid>
  );
};

export default PayWithCard;
