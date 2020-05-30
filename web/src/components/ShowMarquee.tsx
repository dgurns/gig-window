import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import Countdown from './Countdown';
import BuyTicketButton from './BuyTicketButton';

interface ShowMarqueeProps {
  showtime: string;
  payeeUserId: number;
  payeeUsername: string;
}

const useStyles = makeStyles(({ palette, spacing }) => ({
  container: {
    background: 'url("images/curtains.jpg")',
    backgroundColor: palette.common.black,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    height: '100%',
  },
  countdown: {
    margin: spacing(2),
  },
}));

const ShowMarquee = ({
  showtime,
  payeeUsername,
  payeeUserId,
}: ShowMarqueeProps) => {
  const classes = useStyles();

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.container}
    >
      <Grid item className={classes.countdown}>
        <Countdown showtime={showtime} />
      </Grid>
      <BuyTicketButton
        payeeUserId={payeeUserId}
        payeeUsername={payeeUsername}
      />
    </Grid>
  );
};

export default ShowMarquee;
