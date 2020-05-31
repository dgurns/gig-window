import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import usePayments from 'hooks/usePayments';

import Countdown from './Countdown';
import BuyTicketButton from './BuyTicketButton';

const useStyles = makeStyles(({ palette, spacing }) => ({
  container: {
    height: '100%',
  },
  countdown: {
    margin: spacing(2),
    textAlign: 'center',
  },
  message: {
    color: palette.common.white,
  },
}));

interface ShowMarqueeProps {
  show: {
    id: number;
    showtime: string;
  };
  payee: {
    id: number;
    username: string;
    stripeAccountId?: string;
  };
}

const ShowMarquee = ({ show, payee }: ShowMarqueeProps) => {
  const classes = useStyles();

  const { paymentForShow, paymentForShowQuery } = usePayments({
    showId: show.id,
  });

  const renderBuyTicketButton = () => {
    if (paymentForShowQuery.loading)
      return <CircularProgress color="secondary" size={58} />;
    if (paymentForShowQuery.error) {
      return (
        <Typography className={classes.message}>
          Error checking ticket status
        </Typography>
      );
    }
    if (paymentForShow) {
      return (
        <Typography className={classes.message}>
          You're in{' '}
          <span aria-label="thumbs up" role="img">
            👍
          </span>
        </Typography>
      );
    }
    return <BuyTicketButton payee={payee} show={show} />;
  };

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.container}
    >
      <Grid item className={classes.countdown}>
        <Countdown showtime={show.showtime} />
      </Grid>
      {payee.stripeAccountId && renderBuyTicketButton()}
    </Grid>
  );
};

export default ShowMarquee;
