import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';

import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';
import useDialog from 'hooks/useDialog';

import Subheader from 'components/Subheader';
import TextButton from 'components/TextButton';
import StripeConnectIntroMessage from 'components/StripeConnectIntroMessage';

const LOG_OUT = gql`
  mutation LogOut {
    logOut
  }
`;

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  container: {
    padding: `4px ${spacing(3)}px`,
  },
  subheaderLink: {
    margin: `0 ${spacing(3)}px`,
    [breakpoints.down('xs')]: {
      margin: `${spacing(1)}px ${spacing(3)}px`,
    },
  },
  warningIcon: {
    marginBottom: 3,
    marginRight: spacing(1),
  },
  linkStripeAccount: {
    marginBottom: 2,
    marginTop: 2,
    textAlign: 'center',
  },
  linkStripeAccountButton: {
    marginBottom: 3,
  },
}));

const DashboardSubheader = () => {
  const classes = useStyles();
  const { pathname } = useLocation();

  const [StripeConnectIntroDialog, showStripeConnectIntroDialog] = useDialog();

  const [currentUser, currentUserQuery] = useCurrentUser();
  const { isAllowedToStream, stripeConnectAccountId } = currentUser ?? {};

  const [logOut, { data }] = useMutation(LOG_OUT, {
    errorPolicy: 'all',
  });

  useEffect(() => {
    if (data?.logOut) {
      window.location.reload();
    }
  }, [data]);

  const shouldShowLinkStripeAccountMessage =
    isAllowedToStream && !stripeConnectAccountId && !currentUserQuery.loading;

  return (
    <>
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
            {isAllowedToStream && (
              <Link
                to={`${pathname}/edit-shows`}
                component={RouterLink}
                className={classes.subheaderLink}
              >
                Edit shows
              </Link>
            )}
            <Link
              to={`${pathname}/payments`}
              component={RouterLink}
              className={classes.subheaderLink}
            >
              Payments
            </Link>
            <TextButton
              onClick={() => logOut()}
              classes={{ root: classes.subheaderLink }}
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
              <WarningIcon color="secondary" className={classes.warningIcon} />
              <Typography color="secondary">
                In order to play a public show and accept payments, you'll need
                to{' '}
                <TextButton
                  onClick={() => showStripeConnectIntroDialog()}
                  className={classes.linkStripeAccountButton}
                >
                  link a Stripe account
                </TextButton>
              </Typography>
            </Grid>
          )}
        </Grid>
      </Subheader>

      <StripeConnectIntroDialog>
        <StripeConnectIntroMessage />
      </StripeConnectIntroDialog>
    </>
  );
};

export default React.memo(DashboardSubheader);
