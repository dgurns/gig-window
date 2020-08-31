import React from 'react';

import { Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const buildStripeOauthUrl = () => {
  const url = new URL('https://connect.stripe.com/oauth/authorize');
  url.searchParams.set(
    'client_id',
    process.env.REACT_APP_STRIPE_CONNECT_CLIENT_ID ?? ''
  );
  url.searchParams.set('scope', 'read_write');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set(
    'redirect_uri',
    `${window.location.origin}/oauth/stripe-connect`
  );
  return url.toString();
};

const useStyles = makeStyles(({ spacing }) => ({
  title: {
    marginBottom: spacing(3),
  },
  button: {
    marginTop: spacing(3),
  },
}));

const StripeConnectIntroMessage = () => {
  const classes = useStyles();

  return (
    <Grid container direction="column">
      <Typography variant="h4" className={classes.title}>
        Here's how it works:
      </Typography>
      <Typography color="secondary">
        Fan payments will go directly to your bank account, thanks to our
        payment processing partner Stripe. They charge a 2.9% + $0.30 fee to
        process each transaction, then 80% goes to you and 20% goes to this
        project.
        <br />
        <br />
        Stripe is totally free to set up and you own all the payment and
        customer data, which is searchable and exportable anytime through an
        easy dashboard. 
      </Typography>
      <Button
        color="primary"
        variant="contained"
        size="medium"
        onClick={() => (window.location.href = buildStripeOauthUrl())}
        className={classes.button}
      >
        Next
      </Button>
    </Grid>
  );
};

export default StripeConnectIntroMessage;
