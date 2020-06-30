import React, { useState } from 'react';
import addMinutes from 'date-fns/addMinutes';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import PlayButton from '@material-ui/icons/PlayArrow';

import useCurrentUser from 'hooks/useCurrentUser';
import usePayments from 'hooks/usePayments';
import User from 'services/User';

import BuyTicketButton from './BuyTicketButton';
import Countdown from './Countdown';
import VideoPlayer from './VideoPlayer';

const useStyles = makeStyles(({ palette, spacing }) => ({
  container: {
    backgroundColor: palette.common.black,
    height: '100%',
    position: 'relative',
    width: '100%',
  },
  videoOverlay: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 20,
  },
  playButtonContainer: {
    color: palette.common.white,
    cursor: 'pointer',
    height: '100%',
    width: '100%',
    '&:hover #play-button': {
      transform: 'scale(1.18)',
    },
  },
  playButton: {
    fontSize: '10rem',
    transition: 'all 0.2s ease',
  },
  paywallBackgroundGradient: {
    background:
      'linear-gradient(0deg, rgba(0,0,0,1) 20%, rgba(255,255,255,0) 74%)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  paywallContent: {
    marginBottom: spacing(7),
    textAlign: 'center',
    zIndex: 30,
  },
  buyTicketButton: {
    marginTop: spacing(2),
  },
  videoPlayer: {
    height: '100%',
    width: '100%',
    zIndex: 10,
  },
}));

interface LiveVideoAreaProps {
  show?: {
    id: number;
  };
  payee?: {
    id: number;
    username: string;
    awsMediaPackageOriginEndpointUrl?: string;
    stripeAccountId?: string;
  };
}

const LiveVideoArea = ({ show, payee }: LiveVideoAreaProps) => {
  const classes = useStyles();

  const [currentUser] = useCurrentUser();
  const { paymentForShow, recentPaymentsToPayee } = usePayments({
    showId: show?.id,
    payeeUserId: payee?.id,
  });
  const hasAccessToLiveStream = User.hasAccessToLiveStream(
    Boolean(paymentForShow),
    Boolean(recentPaymentsToPayee?.length)
  );

  const [videoIsStarted, setVideoIsStarted] = useState(false);

  const renderVideoOverlay = () => {
    if (!videoIsStarted) {
      return (
        <Grid container className={classes.videoOverlay}>
          <Grid
            item
            container
            justify="center"
            alignItems="center"
            className={classes.playButtonContainer}
            onClick={() => setVideoIsStarted(true)}
          >
            <PlayButton id="play-button" className={classes.playButton} />
          </Grid>
        </Grid>
      );
    }

    if (!payee || hasAccessToLiveStream) {
      return null;
    }

    return (
      <Grid
        container
        direction="column"
        justify="flex-end"
        alignItems="center"
        className={classes.videoOverlay}
      >
        <Grid className={classes.paywallBackgroundGradient} />
        <Grid className={classes.paywallContent}>
          <Countdown
            targetDate={addMinutes(new Date(), 3).toISOString()}
            countdownSuffix="left in free preview"
            postTargetLabel="That's the end of your free preview. Pay what you want to join the show!"
          />
          <BuyTicketButton
            payee={payee}
            show={show}
            buttonText="Pay what you want"
            className={classes.buyTicketButton}
          />
        </Grid>
      </Grid>
    );
  };

  const hlsUrl = payee
    ? payee.awsMediaPackageOriginEndpointUrl
    : currentUser?.awsMediaPackageOriginEndpointUrl;

  return (
    <Grid className={classes.container}>
      {renderVideoOverlay()}
      <Grid item container className={classes.videoPlayer}>
        <VideoPlayer
          hlsUrl={hlsUrl}
          shouldPlay={videoIsStarted}
          shouldHideControls={!videoIsStarted}
        />
      </Grid>
    </Grid>
  );
};

export default LiveVideoArea;
