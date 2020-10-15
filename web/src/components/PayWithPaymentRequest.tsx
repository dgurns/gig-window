import React, { useState, useEffect, useCallback } from "react";
import { useMutation, gql } from "@apollo/client";
import {
  PaymentRequestButtonElement,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  PaymentRequest,
  PaymentRequestPaymentMethodEvent,
} from "@stripe/stripe-js";
import { Grid, Typography, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { User } from "types";

const CREATE_STRIPE_SETUP_INTENT = gql`
  mutation CreateStripeSetupIntent {
    createStripeSetupIntent {
      client_secret
    }
  }
`;

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

const useStyles = makeStyles(({ spacing }) => ({
  container: {
    paddingTop: spacing(1),
  },
  placeholder: {
    height: 88,
  },
  buttonWrapper: {
    height: 40,
    marginBottom: spacing(2),
    textAlign: "center",
    width: "100%",
  },
}));

interface PayWithPaymentRequestProps {
  paymentAmountInCents: number;
  payee: User;
  showId?: number;
  onSuccess: () => void;
}

const PayWithPaymentRequest = (props: PayWithPaymentRequestProps) => {
  const { paymentAmountInCents, payee, showId, onSuccess } = props;
  const classes = useStyles();

  const [paymentError, setPaymentError] = useState("");
  const [paymentIsSubmitting, setPaymentIsSubmitting] = useState(false);

  const [createStripeSetupIntent, setupIntent] = useMutation(
    CREATE_STRIPE_SETUP_INTENT,
    {
      errorPolicy: "all",
    }
  );
  const setupIntentClientSecret =
    setupIntent.data?.createStripeSetupIntent.client_secret;
  const [chargeCardAsPayee, payment] = useMutation(CHARGE_CARD_AS_PAYEE, {
    errorPolicy: "all",
  });

  useEffect(() => {
    createStripeSetupIntent();
  }, [createStripeSetupIntent]);

  useEffect(() => {
    if (payment.data?.chargeCardAsPayee) {
      onSuccess();
    } else if (payment.error) {
      setPaymentError("Could not process payment. Please try again.");
    }
  }, [payment.data, payment.error, onSuccess]);

  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(
    null
  );

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: `Payment to ${payee.username}`,
          amount: paymentAmountInCents,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
        }
      });
    }
  }, [stripe, paymentAmountInCents, payee]);

  const onPaymentMethodSelected = useCallback(
    async (ev: PaymentRequestPaymentMethodEvent) => {
      if (!stripe) return;

      setPaymentError("");
      setPaymentIsSubmitting(true);

      try {
        const setupResult = await stripe.confirmCardSetup(
          setupIntentClientSecret,
          { payment_method: ev.paymentMethod.id },
          { handleActions: false }
        );
        if (
          setupResult.error ||
          setupResult.setupIntent?.status !== "succeeded"
        ) {
          throw new Error();
        }
      } catch (error) {
        setPaymentError(
          "Error confirming payment. Please check your card details or try a different card"
        );
        ev.complete("fail");
        return setPaymentIsSubmitting(false);
      }

      const chargeResult = await chargeCardAsPayee({
        variables: {
          amountInCents: paymentAmountInCents,
          payeeUserId: payee.id,
          showId,
          shouldDetachPaymentMethodAfter: true,
        },
      });
      if (chargeResult.data?.chargeCardAsPayee) {
        ev.complete("success");
      } else {
        setPaymentError(
          "Error charging card. Please try again or use a different card."
        );
        ev.complete("fail");
      }
      return setPaymentIsSubmitting(false);
    },
    [
      stripe,
      paymentAmountInCents,
      payee,
      showId,
      chargeCardAsPayee,
      setupIntentClientSecret,
    ]
  );

  useEffect(() => {
    if (paymentRequest) {
      paymentRequest.on("paymentmethod", onPaymentMethodSelected);
    }
  }, [paymentRequest, onPaymentMethodSelected]);

  if (!paymentRequest || !stripe) {
    return null;
  }

  if (paymentRequest && setupIntent.loading) {
    return <div className={classes.placeholder} />;
  }

  if (setupIntent.error) {
    return (
      <Typography color="secondary">
        Error initializing system payment button
      </Typography>
    );
  }

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      className={classes.container}
    >
      <Grid className={classes.buttonWrapper}>
        {paymentIsSubmitting ? (
          <CircularProgress color="secondary" size={18} />
        ) : (
          <PaymentRequestButtonElement options={{ paymentRequest }} />
        )}
      </Grid>
      {paymentError && <Typography color="error">{paymentError}</Typography>}
      <Typography color="secondary">OR</Typography>
    </Grid>
  );
};

export default PayWithPaymentRequest;
