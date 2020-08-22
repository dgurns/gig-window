import React, { useMemo } from 'react';
import {
  Paper,
  Button,
  Grid,
  Container,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';
import useShowsForUser from 'hooks/useShowsForUser';
import DateTime from 'services/DateTime';
import Image from 'services/Image';

import DashboardSubheader from 'components/DashboardSubheader';
import DashboardModeSwitcher from 'components/DashboardModeSwitcher';
import LiveVideoArea from 'components/LiveVideoArea';
import ChatBox from 'components/ChatBox';
import HowToBroadcast from 'components/HowToBroadcast';

const useStyles = makeStyles(({ breakpoints, palette, spacing }) => ({
  container: {
    paddingBottom: spacing(4),
  },
  artistInfoContainer: {
    alignItems: 'center',
    padding: `${spacing(4)}px ${spacing(4)}px`,
    [breakpoints.down('xs')]: {
      alignItems: 'flex-start',
      flexDirection: 'column-reverse',
      padding: `${spacing(3)}px ${spacing(3)}px`,
    },
  },
  artistImage: {
    height: 80,
    marginRight: spacing(2),
    width: 80 * Image.DEFAULT_IMAGE_ASPECT_RATIO,
    [breakpoints.down('xs')]: {
      marginTop: spacing(2),
    },
  },
  artistText: {
    flexDirection: 'column',
  },
  videoChatContainer: {
    flexDirection: 'row',
    height: 520,
    [breakpoints.down('xs')]: {
      flexDirection: 'column',
      height: 'auto',
    },
  },
  videoContainer: {
    backgroundColor: palette.common.black,
    height: '100%',
    [breakpoints.down('xs')]: {
      minHeight: 230,
    },
  },
  requestAccessMessage: {
    color: palette.common.white,
  },
  requestAccessButton: {
    marginTop: spacing(2),
  },
  streamPreviewMessage: {
    color: palette.common.white,
    marginRight: spacing(2),
    textAlign: 'center',
  },
  startingVideoInfrastructureProgress: {
    marginTop: spacing(2),
    width: 100,
  },
  chat: {
    backgroundColor: palette.common.white,
    height: '100%',
    [breakpoints.down('xs')]: {
      height: 260,
    },
  },
  tools: {
    marginTop: spacing(2),
    [breakpoints.down('sm')]: {
      padding: `0 ${spacing(2)}px`,
    },
  },
  howTo: {
    padding: `${spacing(4)}px ${spacing(4)}px ${spacing(12)}px`,
    [breakpoints.down('xs')]: {
      padding: `${spacing(3)}px ${spacing(3)}px`,
    },
  },
}));

const Dashboard = () => {
  const classes = useStyles();

  const [currentUser] = useCurrentUser({ subscribe: true });
  const {
    id,
    username,
    profileImageUrl,
    isAllowedToStream,
    muxLiveStreamStatus,
  } = currentUser ?? {};

  const [, showsQuery, activeShow] = useShowsForUser(currentUser?.id);

  const activeShowText = useMemo(() => {
    if (showsQuery.loading) {
      return <CircularProgress size={15} color="secondary" />;
    } else if (showsQuery.error) {
      return 'Error fetching shows';
    } else if (activeShow) {
      return `${DateTime.formatUserReadableShowtime(activeShow.showtime)}: ${
        activeShow.title
      }`;
    } else {
      return 'No shows scheduled';
    }
  }, [showsQuery, activeShow]);

  const streamPreviewMessage = useMemo(() => {
    let message;
    switch (muxLiveStreamStatus) {
      case 'connected':
        message = 'Encoder connected. Start streaming when ready.';
      case 'recording':
        message = 'Receiving stream and preparing for playback...';
      default:
        message = 'No stream detected';
    }
    return (
      <>
        <Typography className={classes.streamPreviewMessage}>
          {message}
        </Typography>
        {muxLiveStreamStatus === 'recording' && (
          <CircularProgress
            color="secondary"
            className={classes.startingVideoInfrastructureProgress}
          />
        )}
      </>
    );
  }, [muxLiveStreamStatus, classes]);

  const videoArea = useMemo(() => {
    if (!isAllowedToStream) {
      return (
        <>
          <Typography className={classes.requestAccessMessage}>
            Would you like to stream?
          </Typography>
          <Button
            color="primary"
            variant="contained"
            size="medium"
            className={classes.requestAccessButton}
            onClick={() =>
              window.open(process.env.REACT_APP_REQUEST_ACCESS_FORM_URL)
            }
          >
            Request access
          </Button>
        </>
      );
    } else if (muxLiveStreamStatus === 'active') {
      return <LiveVideoArea />;
    } else {
      return streamPreviewMessage;
    }
  }, [isAllowedToStream, muxLiveStreamStatus, streamPreviewMessage, classes]);

  if (!currentUser) {
    return (
      <Container disableGutters maxWidth={false} className={classes.container}>
        <Grid container direction="row" className={classes.artistInfoContainer}>
          <Typography color="secondary">Loading...</Typography>
        </Grid>
      </Container>
    );
  }

  return (
    <>
      <DashboardSubheader />

      <Container disableGutters maxWidth={false} className={classes.container}>
        <Grid container direction="row" className={classes.artistInfoContainer}>
          {profileImageUrl && (
            <img
              src={profileImageUrl}
              alt="User"
              className={classes.artistImage}
            />
          )}
          <Grid item className={classes.artistText}>
            <Typography variant="h6">{username}</Typography>
            {isAllowedToStream && (
              <Typography color="textSecondary">{activeShowText}</Typography>
            )}
          </Grid>
        </Grid>

        <Paper elevation={3}>
          {isAllowedToStream && <DashboardModeSwitcher />}
          <Grid container className={classes.videoChatContainer}>
            <Grid
              item
              container
              xs={12}
              sm={8}
              direction="column"
              justify="center"
              alignItems="center"
              className={classes.videoContainer}
            >
              {videoArea}
            </Grid>
            <Grid item container xs={false} sm={4} className={classes.chat}>
              <ChatBox userId={id} />
            </Grid>
          </Grid>
        </Paper>

        {isAllowedToStream && (
          <Grid
            container
            item
            direction="column"
            xs={12}
            sm={8}
            className={classes.howTo}
          >
            <HowToBroadcast />
          </Grid>
        )}
      </Container>
    </>
  );
};

export default Dashboard;
