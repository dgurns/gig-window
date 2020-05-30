import React from 'react';
import { useQuery, gql } from '@apollo/client';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';

import Countdown from './Countdown';
import BuyTicketButton from './BuyTicketButton';

const GET_USER_PAYMENT_FOR_SHOW = gql`
  query GetUserPaymentForShow($showId: Int!) {
    getUserPaymentForShow(showId: $showId) {
      id
    }
  }
`;

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
  const [currentUser] = useCurrentUser();

  const { loading, data, error } = useQuery(GET_USER_PAYMENT_FOR_SHOW, {
    variables: { showId: show.id },
    skip: !currentUser,
  });

  const renderBuyTicketButton = () => {
    if (loading) return <CircularProgress color="secondary" size={58} />;
    if (error) {
      return (
        <Typography className={classes.message}>
          Error checking ticket status
        </Typography>
      );
    }
    if (data?.getUserPaymentForShow) {
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
