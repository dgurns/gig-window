import React from 'react';

import useDialog from 'hooks/useDialog';

import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { amber } from '@material-ui/core/colors';
import WarningIcon from '@material-ui/icons/Warning';

import TextButton from 'components/TextButton';
import StripeConnectIntroMessage from 'components/StripeConnectIntroMessage';

const useStyles = makeStyles(({ breakpoints, spacing }) => ({
  container: {
    backgroundColor: amber[200],
    justifyContent: 'flex-start',
    padding: `${spacing(1)}px ${spacing(2)}px`,
    [breakpoints.down('xs')]: {
      justifyContent: 'center',
      textAlign: 'center',
    },
  },
  warningIcon: {
    marginBottom: 3,
    marginRight: spacing(1),
  },
  heading: {
    fontWeight: 'bold',
    marginRight: spacing(1),
  },
  separator: {
    padding: `0 ${spacing(1)}px`,
  },
}));

const LinkStripeAccountBanner = () => {
  const classes = useStyles();

  const [StripeConnectIntroDialog, showStripeConnectIntroDialog] = useDialog();

  return (
    <>
      <Grid
        container
        direction="row"
        alignItems="center"
        className={classes.container}
      >
        <WarningIcon className={classes.warningIcon} />
        <Typography className={classes.heading}>
          One more step - in order to play a public show and accept payments:
        </Typography>
        <TextButton onClick={() => showStripeConnectIntroDialog()}>
          Link a Stripe account
        </TextButton>
        <Typography color="secondary" className={classes.separator}>
          /
        </Typography>
        <TextButton onClick={() => showStripeConnectIntroDialog()}>
          What is Stripe?
        </TextButton>
      </Grid>

      <StripeConnectIntroDialog>
        <StripeConnectIntroMessage />
      </StripeConnectIntroDialog>
    </>
  );
};

export default LinkStripeAccountBanner;
