import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { Show, User } from 'types';

import BuyTicketButton from './BuyTicketButton';

const useStyles = makeStyles(({ palette, spacing }) => ({
  container: {
    height: '100%',
  },
  message: {
    color: palette.common.white,
    margin: spacing(2),
    textAlign: 'center',
  },
  buyTicketWrapper: {
    height: 65,
    width: 'auto',
  },
}));

interface PaywallProps {
  show?: Show;
  payee: User;
}

const Paywall = ({ show, payee }: PaywallProps) => {
  const classes = useStyles();

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.container}
    >
      <Typography className={classes.message}>
        Your free preview is up! Pay what you want to join the show.
      </Typography>
      <Grid
        item
        container
        direction="column"
        className={classes.buyTicketWrapper}
      >
        <BuyTicketButton payee={payee} show={show} />
      </Grid>
    </Grid>
  );
};

export default Paywall;
