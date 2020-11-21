import React, { useState, useEffect, useMemo } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import PlayButton from '@material-ui/icons/PlayArrow';

import useCurrentUser from 'hooks/useCurrentUser';
import usePayments from 'hooks/usePayments';
import useFreePreview from 'hooks/useFreePreview';
import UserService from 'services/User';
import { Show, User } from 'types';

import BuyTicketButton from './BuyTicketButton';
import Countdown from './Countdown';
import HlsPlayer from './HlsPlayer';

const useStyles = makeStyles(({ palette, spacing, breakpoints }) => ({
  container: {
    backgroundColor: palette.common.black,
    height: '100%',
    overflowX: 'hidden',
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
      'linear-gradient(0deg, rgba(0,0,0,0.8) 43%, rgba(255,255,255,0) 74%)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    [breakpoints.up('sm')]: {
      background:
        'linear-gradient(0deg, rgba(0,0,0,0.8) 32%, rgba(255,255,255,0) 74%)',
    },
  },
  paywallContent: {
    marginBottom: spacing(3),
    textAlign: 'center',
    zIndex: 30,
    [breakpoints.up('sm')]: {
      marginBottom: spacing(5),
    },
  },
  freePreviewCountdown: {
    color: palette.common.white,
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
  show?: Show;
  payee?: User;
}

const LiveVideoArea = ({ show, payee }: LiveVideoAreaProps) => {
  const classes = useStyles();

  const [currentUser] = useCurrentUser();
  const { paymentForShow, recentPaymentsToPayee } = usePayments({
    showId: show?.id,
    payeeUserId: payee?.id,
  });
  const { freePreviewExpiryDate, setFreePreviewExpiryDate } = useFreePreview({
    userUrlSlug: payee?.urlSlug,
  });
  const hasAccessToLiveVideo = UserService.hasAccessToLiveVideo({
    user: currentUser,
    paymentForShow,
    recentPaymentsToPayee,
  });

  const [videoIsStarted, setVideoIsStarted] = useState(false);

  useEffect(() => {
    if (payee && !hasAccessToLiveVideo && !freePreviewExpiryDate) {
      setFreePreviewExpiryDate();
    }
  }, [
    payee,
    hasAccessToLiveVideo,
    freePreviewExpiryDate,
    setFreePreviewExpiryDate,
  ]);

  const videoOverlay = useMemo(() => {
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
    } else if (!payee || hasAccessToLiveVideo) {
      return null;
    } else {
      const minPriceInCents = show?.minPriceInCents ?? 100;
      const payButtonText =
        minPriceInCents > 100 ? 'Buy ticket' : 'Pay what you want';
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
            {freePreviewExpiryDate && (
              <Countdown
                targetDate={freePreviewExpiryDate}
                countdownSuffix="left in free preview"
                postTargetLabel="That's the end of your free preview. Buy a ticket to join the show!"
                onTargetDateReached={() => window.location.reload()}
                className={classes.freePreviewCountdown}
              />
            )}
            <BuyTicketButton
              payee={payee}
              show={show}
              buttonText={payButtonText}
              className={classes.buyTicketButton}
            />
          </Grid>
        </Grid>
      );
    }
  }, [
    classes,
    videoIsStarted,
    payee,
    show,
    hasAccessToLiveVideo,
    freePreviewExpiryDate,
  ]);

  const muxPlaybackId = payee
    ? payee.muxPlaybackId
    : currentUser?.muxPlaybackId;
  const hlsUrl = `https://stream.mux.com/${muxPlaybackId}.m3u8`;

  return (
    <Grid className={classes.container}>
      {videoOverlay}
      <Grid item container className={classes.videoPlayer}>
        <HlsPlayer
          hlsUrl={hlsUrl}
          shouldPlay={videoIsStarted}
          shouldHideControls={!videoIsStarted}
        />
      </Grid>
    </Grid>
  );
};

export default LiveVideoArea;
