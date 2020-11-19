import React, { useMemo, useState, useEffect } from 'react';
import classnames from 'classnames';

import { Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PlayButton from '@material-ui/icons/PlayArrow';

import useUser from 'hooks/useUser';
import useShowsForUser from 'hooks/useShowsForUser';

import Countdown from 'components/Countdown';
import HlsPlayer from 'components/HlsPlayer';
import UserInfoBlock from 'components/UserInfoBlock';

const useStyles = makeStyles(({ palette, spacing, breakpoints }) => ({
  container: {
    background: 'url("/images/curtains.jpg")',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    bottom: 0,
    color: palette.common.white,
    left: 0,
    paddingBottom: spacing(8),
    paddingLeft: spacing(4),
    paddingRight: spacing(4),
    position: 'absolute',
    right: 0,
    top: 0,
    '&:hover #play-button': {
      transform: 'scale(1.24)',
    },
    [breakpoints.down('xs')]: {
      paddingBottom: spacing(10),
    },
  },
  videoPlayer: {
    backgroundColor: palette.common.black,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  videoOverlayGradient: {
    background:
      'linear-gradient(0deg, rgba(0,0,0,0.8) 43%, rgba(255,255,255,0) 74%)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    [breakpoints.up('xs')]: {
      background:
        'linear-gradient(0deg, rgba(0,0,0,0.8) 32%, rgba(255,255,255,0) 74%)',
    },
  },
  primaryContentText: {
    color: palette.secondary.main,
    margin: spacing(2),
    textAlign: 'center',
  },
  buyTicketWrapper: {
    height: 65,
    width: 'auto',
  },
  secondaryContent: {
    alignItems: 'center',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 0,
    padding: spacing(2),
    paddingBottom: 0,
    position: 'absolute',
    right: 0,
    [breakpoints.down('xs')]: {
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
  },
  userInfo: {
    cursor: 'pointer',
    paddingBottom: spacing(2),
    paddingRight: spacing(2),
  },
  playButtonContainer: {
    color: palette.common.white,
    cursor: 'pointer',
    width: 'auto',
  },
  playButton: {
    fontSize: '7rem',
    transition: 'all 0.2s ease',
  },
  secondaryCta: {
    marginBottom: spacing(2),
    marginRight: spacing(1),
    [breakpoints.down('xs')]: {
      marginBottom: spacing(3),
      marginTop: spacing(1),
    },
  },
}));

const navigateToProfile = (urlSlug: string) => {
  window.open(`/${urlSlug}`);
};

const EmbeddedPlayer = () => {
  const classes = useStyles();

  const urlSlug = window.location.pathname.split('/')[2];
  const [user, userQuery] = useUser({ urlSlug, subscribe: true });
  const [, showsQuery, activeShow] = useShowsForUser(user?.id);

  const [videoIsStarted, setVideoIsStarted] = useState(false);
  const [previewIsOver, setPreviewIsOver] = useState(false);

  useEffect(() => {
    if (!videoIsStarted) {
      return;
    }
    // Only set timer if video is started
    const lengthOfPreview = 1000 * 60 * 2; // 2 minutes
    const previewTimer = setTimeout(
      () => setPreviewIsOver(true),
      lengthOfPreview
    );
    return () => clearTimeout(previewTimer);
  }, [videoIsStarted]);

  const userIsStreamingLive =
    user?.isInPublicMode && user?.muxLiveStreamStatus === 'active';

  const primaryContent = useMemo(() => {
    if (userQuery.loading || showsQuery.loading) {
      return null;
    } else if (!user) {
      return (
        <Typography align="center">
          Error fetching the user "{urlSlug}". Please double-check your embed
          code.
        </Typography>
      );
    } else if (
      activeShow &&
      user.stripeConnectAccountId &&
      !userIsStreamingLive
    ) {
      return (
        <>
          <Countdown
            targetDate={activeShow.showtime}
            countdownSuffix="until showtime"
            postTargetLabel="Waiting for stream"
            className={classes.primaryContentText}
          />
          <Grid
            item
            container
            direction="column"
            className={classes.buyTicketWrapper}
          >
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={() => navigateToProfile(urlSlug)}
            >
              Buy ticket
            </Button>
          </Grid>
        </>
      );
    } else if (user.stripeConnectAccountId && !userIsStreamingLive) {
      return (
        <>
          <Typography className={classes.primaryContentText}>
            Support {user.username}
          </Typography>
          <Grid
            item
            container
            direction="column"
            className={classes.buyTicketWrapper}
          >
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={() => navigateToProfile(urlSlug)}
            >
              Tip
            </Button>
          </Grid>
        </>
      );
    } else if (userIsStreamingLive && previewIsOver) {
      return (
        <Button
          variant="contained"
          size="large"
          color="primary"
          onClick={() => navigateToProfile(urlSlug)}
        >
          Keep watching?
        </Button>
      );
    }
  }, [
    userQuery,
    showsQuery,
    user,
    urlSlug,
    activeShow,
    classes,
    userIsStreamingLive,
    previewIsOver,
  ]);

  const secondaryContent = useMemo(() => {
    const shouldShowPlayButton =
      userIsStreamingLive && !previewIsOver && !videoIsStarted;
    const shouldShowPayWhatYouWantButton =
      userIsStreamingLive && !previewIsOver && videoIsStarted;

    if (!user || userQuery.loading || showsQuery.loading) {
      return null;
    } else {
      return (
        <Grid container className={classes.secondaryContent}>
          <div onClick={() => navigateToProfile(urlSlug)}>
            <UserInfoBlock user={user} className={classes.userInfo} />
          </div>
          {shouldShowPlayButton && (
            <Grid
              item
              container
              justify="center"
              alignItems="center"
              className={classnames(
                classes.secondaryCta,
                classes.playButtonContainer
              )}
              onClick={() => setVideoIsStarted(true)}
            >
              <PlayButton id="play-button" className={classes.playButton} />
            </Grid>
          )}
          {shouldShowPayWhatYouWantButton && (
            <Button
              variant="contained"
              size="large"
              color="primary"
              className={classes.secondaryCta}
              onClick={() => navigateToProfile(urlSlug)}
            >
              Pay what you want
            </Button>
          )}
        </Grid>
      );
    }
  }, [
    userQuery,
    showsQuery,
    user,
    classes,
    urlSlug,
    userIsStreamingLive,
    videoIsStarted,
    previewIsOver,
  ]);

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.container}
    >
      {userIsStreamingLive && !previewIsOver && (
        <Grid
          item
          container
          className={classes.videoPlayer}
          onClick={() =>
            !videoIsStarted
              ? setVideoIsStarted(true)
              : navigateToProfile(urlSlug)
          }
        >
          <HlsPlayer
            hlsUrl={`https://stream.mux.com/${user?.muxPlaybackId}.m3u8`}
            shouldPlay={videoIsStarted}
            shouldHideControls={!videoIsStarted}
          />
          <div className={classes.videoOverlayGradient} />
        </Grid>
      )}
      {primaryContent}
      {secondaryContent}
    </Grid>
  );
};

export default EmbeddedPlayer;
