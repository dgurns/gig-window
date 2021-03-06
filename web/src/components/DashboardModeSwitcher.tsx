import React from 'react';
import { useMutation, gql } from '@apollo/client';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';
import TextButton from 'components/TextButton';

const SET_PUBLIC_MODE = gql`
  mutation SetPublicMode($publicMode: Boolean!) {
    setPublicMode(publicMode: $publicMode) {
      isInPublicMode
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  modeSwitcher: {
    backgroundColor: theme.palette.common.white,
    padding: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center',
    },
  },
  previewModeColorBand: {
    backgroundColor: theme.palette.warning.main,
    height: 3,
  },
  publicModeColorBand: {
    backgroundColor: theme.palette.success.main,
    height: 3,
  },
  switchStreamModeButton: {
    marginLeft: theme.spacing(2),
  },
}));

const DashboardModeSwitcher = () => {
  const classes = useStyles();

  const [currentUser] = useCurrentUser({ subscribe: true });
  const isInPublicMode = currentUser?.isInPublicMode;

  const [setPublicMode, { loading }] = useMutation(SET_PUBLIC_MODE);

  const onTogglePublicMode = () => {
    if (!currentUser?.stripeConnectAccountId && !isInPublicMode) {
      return window.alert(
        "You need to link a Stripe account before you can switch to public mode. Stripe is a payment processor which enables fan payments to go directly to your bank account, and it's free to set up."
      );
    } else {
      return setPublicMode({
        variables: { publicMode: !Boolean(isInPublicMode) },
      });
    }
  };

  return (
    <Grid container direction="column">
      <Grid
        className={
          isInPublicMode
            ? classes.publicModeColorBand
            : classes.previewModeColorBand
        }
      />
      <Grid
        container
        justify="center"
        alignItems="center"
        className={classes.modeSwitcher}
      >
        {currentUser && (
          <>
            <Typography>
              {isInPublicMode
                ? "You're in public mode (everyone can see your stream)"
                : "You're in private mode (nobody can see your stream)"}
            </Typography>
            <TextButton
              onClick={onTogglePublicMode}
              className={classes.switchStreamModeButton}
              disabled={loading}
            >
              {`Switch to ${isInPublicMode ? 'private' : 'public'}`}
            </TextButton>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default DashboardModeSwitcher;
