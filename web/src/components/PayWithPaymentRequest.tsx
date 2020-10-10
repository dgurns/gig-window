import React, { useState, useEffect, useCallback } from "react";
import { useQuery, gql } from "@apollo/client";
import {
  PaymentRequestButtonElement,
  useStripe,
} from "@stripe/react-stripe-js";
import { PaymentRequest } from "@stripe/stripe-js";
import { Grid, Typography, Divider, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { User } from "types";

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
    alignSelf: "center",
    marginTop: theme.spacing(1),
  },
}));

interface PayWithPaymentRequestProps {
  paymentAmountInCents: number;
  payee: User;
  showId?: number;
  onSuccess?: () => void;
}

const PayWithPaymentRequest = (props: PayWithPaymentRequestProps) => {
  const { paymentAmountInCents, payee, showId, onSuccess } = props;
  const classes = useStyles();

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

      console.log({ pr });

      pr.canMakePayment().then((result) => {
        console.log("Apple Pay", result?.applePay);
        if (result) {
          setPaymentRequest(pr);
        }
      });
    }
  }, [stripe, paymentAmountInCents, payee]);

  if (!paymentRequest) {
    return null;
  }

  return (
    <Grid container direction="column">
      <PaymentRequestButtonElement options={{ paymentRequest }} />
    </Grid>
  );
};

export default PayWithPaymentRequest;
