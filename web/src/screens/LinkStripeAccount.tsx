import React, { useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const COMPLETE_STRIPE_CONNECT_OAUTH_FLOW = gql`
  mutation CompleteStripeConnectOauthFlow($stripeAuthorizationCode: String!) {
    completeStripeConnectOauthFlow(
      authorizationCode: $stripeAuthorizationCode
    ) {
      stripeAccountId
      urlSlug
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
}));

const LinkStripeAccount = () => {
  const classes = useStyles();
  const { searchParams } = new URL(window.location.href);
  const stripeAuthorizationCode = searchParams.get('code');

  const [completeOauthFlow, { loading, data, error }] = useMutation(
    COMPLETE_STRIPE_CONNECT_OAUTH_FLOW,
    {
      errorPolicy: 'all',
    }
  );
  const { stripeAccountId, urlSlug } =
    data?.completeStripeConnectOauthFlow || {};

  useEffect(() => {
    if (stripeAuthorizationCode) {
      completeOauthFlow({
        variables: { stripeAuthorizationCode },
      });
    }
  }, [stripeAuthorizationCode, completeOauthFlow]);

  const waitingForMutation = !loading && !data && !error;

  const renderContent = () => {
    if (waitingForMutation || loading) {
      return (
        <>
          <Typography variant="h6" className={classes.title}>
            Linking Stripe account
          </Typography>
          <CircularProgress color="secondary" />
        </>
      );
    } else if (!stripeAuthorizationCode) {
      return (
        <Typography color="secondary">
          No authorization code provided
        </Typography>
      );
    } else if (error || !stripeAccountId) {
      return (
        <>
          <Typography variant="h6" className={classes.title}>
            Error linking Stripe account
          </Typography>
          <Typography color="secondary">Please try again</Typography>
        </>
      );
    }

    return (
      <>
        <Typography variant="h6" className={classes.title}>
          Stripe account linked successfully!
        </Typography>
        <Typography>
          Now all incoming payments will go directly to your Stripe account.
          Stripe takes 2.9% + $0.30 of each payment. From there, 80% goes to you
          and the platform takes 20% to cover video and operating costs.
          <br />
          <br />
          Since you own the Stripe account, you'll have full access to all the
          payments and customer data.
          <br />
          <br />
          You're all set... you can start playing shows and accepting payments
          whenever.
          <br />
          <br />
          <Link href={`/${urlSlug}`}>Go to profile</Link>
        </Typography>
      </>
    );
  };

  return (
    <Container disableGutters maxWidth="sm">
      <Grid
        container
        direction="column"
        alignItems="center"
        className={classes.content}
      >
        {renderContent()}
      </Grid>
    </Container>
  );
};

export default LinkStripeAccount;
