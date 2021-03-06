import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import usePayments from 'hooks/usePayments';
import { User, Show } from 'types';

import Countdown from './Countdown';
import BuyTicketButton from './BuyTicketButton';

const useStyles = makeStyles(({ palette, spacing }) => ({
  container: {
    height: '100%',
  },
  countdown: {
    color: palette.secondary.main,
    margin: spacing(2),
    textAlign: 'center',
  },
  message: {
    color: palette.common.white,
  },
  buyTicketWrapper: {
    height: 65,
    width: 'auto',
  },
}));

interface ShowMarqueeProps {
  show: Show;
  payee: User;
}

const ShowMarquee = ({ show, payee }: ShowMarqueeProps) => {
  const classes = useStyles();

  const {
    paymentForShow,
    paymentForShowQuery: { loading, error },
  } = usePayments({
    showId: show.id,
  });

  const renderBuyTicketButton = () => {
    if (error) {
      return (
        <Typography className={classes.message}>
          Error checking ticket status
        </Typography>
      );
    } else if (paymentForShow) {
      return (
        <Typography className={classes.message}>
          You're in{' '}
          <span aria-label="thumbs up" role="img">
            👍
          </span>
        </Typography>
      );
    } else {
      return <BuyTicketButton payee={payee} show={show} loading={loading} />;
    }
  };

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.container}
    >
      <Countdown
        targetDate={show.showtime}
        countdownSuffix="until showtime"
        postTargetLabel="Waiting for stream"
        className={classes.countdown}
      />
      <Grid
        item
        container
        direction="column"
        className={classes.buyTicketWrapper}
      >
        {payee.stripeConnectAccountId && renderBuyTicketButton()}
      </Grid>
    </Grid>
  );
};

export default ShowMarquee;
