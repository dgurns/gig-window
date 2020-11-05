import React, { useMemo, useState } from 'react';
import classnames from 'classnames';

import { Grid, Typography, CircularProgress, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PlayButton from '@material-ui/icons/PlayArrow';

import useUser from 'hooks/useUser';
import useShowsForUser from 'hooks/useShowsForUser';
import DateTime from 'services/DateTime';
import Image from 'services/Image';

import Countdown from 'components/Countdown';
import HlsPlayer from 'components/HlsPlayer';

const useStyles = makeStyles(({ palette, spacing, breakpoints }) => ({
  container: {
    backgroundColor: palette.common.black,
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
    [breakpoints.down('xs')]: {
      paddingBottom: spacing(10),
    },
  },
  videoPlayer: {
    height: '100%',
    width: '100%',
    '&:hover #play-button': {
      transform: 'scale(1.18)',
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
    padding: spacing(3),
    position: 'absolute',
    right: 0,
    [breakpoints.down('xs')]: {
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
  },
  userInfoContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    paddingRight: spacing(2),
  },
  userImage: {
    height: 80,
    marginRight: spacing(2),
    width: 80 * Image.DEFAULT_IMAGE_ASPECT_RATIO,
  },
  userText: {
    flexDirection: 'column',
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
    [breakpoints.down('xs')]: {
      marginTop: spacing(2),
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

  const activeShowDescription = useMemo(() => {
    if (showsQuery.loading) {
      return <CircularProgress size={19} color="secondary" />;
    } else if (showsQuery.error) {
      return (
        <Typography color="textSecondary">Error fetching shows</Typography>
      );
    } else if (activeShow) {
      return (
        <Typography color="textSecondary">
          {`${DateTime.formatUserReadableShowtime(activeShow.showtime)}: ${
            activeShow.title
          }`}
        </Typography>
      );
    } else {
      return <Typography color="textSecondary">No shows scheduled</Typography>;
    }
  }, [showsQuery, activeShow]);

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
    }
  }, [
    userQuery,
    showsQuery,
    user,
    urlSlug,
    activeShow,
    classes,
    userIsStreamingLive,
  ]);

  const secondaryContent = useMemo(() => {
    if (!user || userQuery.loading || showsQuery.loading) {
      return null;
    } else {
      return (
        <Grid container className={classes.secondaryContent}>
          <Grid
            className={classes.userInfoContainer}
            onClick={() => navigateToProfile(urlSlug)}
          >
            {user.profileImageUrl && (
              <img
                src={user.profileImageUrl}
                alt={user.username}
                className={classes.userImage}
              />
            )}
            <Grid item className={classes.userText}>
              <Typography variant="h6">{user.username}</Typography>
              {user?.isAllowedToStream && activeShowDescription}
            </Grid>
          </Grid>
          {userIsStreamingLive && !videoIsStarted && (
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
          {userIsStreamingLive && !videoIsStarted && (
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
    activeShowDescription,
    classes,
    urlSlug,
    userIsStreamingLive,
    videoIsStarted,
  ]);

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.container}
    >
      {userIsStreamingLive && (
        <Grid
          item
          container
          className={classes.videoPlayer}
          onClick={() => setVideoIsStarted(true)}
        >
          <HlsPlayer
            hlsUrl={`https://stream.mux.com/${user?.muxPlaybackId}.m3u8`}
            shouldPlay={videoIsStarted}
            shouldHideControls={!videoIsStarted}
          />
        </Grid>
      )}
      {primaryContent}
      {secondaryContent}
    </Grid>
  );
};

export default EmbeddedPlayer;
