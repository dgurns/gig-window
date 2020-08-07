import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';

import Subheader from 'components/Subheader';
import TextButton from 'components/TextButton';

const LOG_OUT = gql`
  mutation LogOut {
    logOut
  }
`;

const useStyles = makeStyles((theme) => ({
  container: {
    padding: `4px ${theme.spacing(3)}px`,
  },
  subheaderLink: {
    margin: `0 ${theme.spacing(3)}px`,
    [theme.breakpoints.down('xs')]: {
      margin: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
    },
  },
  linkStripeAccount: {
    marginBottom: 2,
    marginTop: 6,
    textAlign: 'center',
  },
}));

const DashboardSubheader = () => {
  const classes = useStyles();
  const [currentUser, currentUserQuery] = useCurrentUser();
  const { pathname } = useLocation();

  const [logOut, { data }] = useMutation(LOG_OUT, {
    errorPolicy: 'all',
  });

  useEffect(() => {
    if (data?.logOut) {
      window.location.reload();
    }
  }, [data]);

  const buildStripeOauthUrl = () => {
    const url = new URL('https://connect.stripe.com/oauth/authorize');
    url.searchParams.set(
      'client_id',
      process.env.REACT_APP_STRIPE_CONNECT_CLIENT_ID ?? ''
    );
    url.searchParams.set('scope', 'read_write');
    url.searchParams.set('response_type', 'code');
    return url.toString();
  };

  const shouldShowLinkStripeAccountMessage =
    !currentUser?.stripeAccountId && !currentUserQuery.loading;

  return (
    <Subheader>
      <Grid
        container
        direction="column"
        alignItems="center"
        className={classes.container}
      >
        <Grid
          item
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Link
            to={`${pathname}/edit-profile`}
            component={RouterLink}
            className={classes.subheaderLink}
          >
            Edit profile
          </Link>
          <Link
            to={`${pathname}/edit-shows`}
            component={RouterLink}
            className={classes.subheaderLink}
          >
            Edit shows
          </Link>
          <Link
            to={`${pathname}/payments`}
            component={RouterLink}
            className={classes.subheaderLink}
          >
            Payments
          </Link>
          <TextButton
            onClick={() => logOut()}
            className={classes.subheaderLink}
          >
            Log out
          </TextButton>
        </Grid>

        {shouldShowLinkStripeAccountMessage && (
          <Grid
            item
            container
            direction="row"
            justify="center"
            alignItems="center"
            className={classes.linkStripeAccount}
          >
            <Typography color="secondary">
              In order to play a public show and accept payments, you'll need to{' '}
              <Link href={buildStripeOauthUrl()}>link a Stripe account</Link>
            </Typography>
          </Grid>
        )}
      </Grid>
    </Subheader>
  );
};

export default DashboardSubheader;
