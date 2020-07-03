import React from 'react';
import {
  Paper,
  Grid,
  Container,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';
import useShowsForUser from 'hooks/useShowsForUser';
import useLiveVideo from 'hooks/useLiveVideo';
import DateTime from 'services/DateTime';
import Image from 'services/Image';

import DashboardSubheader from 'components/DashboardSubheader';
import DashboardModeSwitcher from 'components/DashboardModeSwitcher';
import LiveVideoArea from 'components/LiveVideoArea';
import ChatBox from 'components/ChatBox';
import HowToBroadcast from 'components/HowToBroadcast';

const useStyles = makeStyles((theme) => ({
  pageContent: {
    paddingTop: 35,
    width: '100%',
  },
  artistInfoContainer: {
    alignItems: 'center',
    padding: `${theme.spacing(4)}px ${theme.spacing(4)}px`,
    [theme.breakpoints.down('xs')]: {
      alignItems: 'flex-start',
      flexDirection: 'column-reverse',
      padding: `${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
  },
  artistImage: {
    height: 80,
    marginRight: theme.spacing(2),
    width: 80 * Image.DEFAULT_IMAGE_ASPECT_RATIO,
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(2),
    },
  },
  artistText: {
    flexDirection: 'column',
  },
  videoChatContainer: {
    flexDirection: 'row',
    height: 520,
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      height: 'auto',
    },
  },
  videoContainer: {
    backgroundColor: theme.palette.common.black,
    height: '100%',
    [theme.breakpoints.down('xs')]: {
      minHeight: 230,
    },
  },
  streamPreviewMessage: {
    color: theme.palette.common.white,
    marginRight: theme.spacing(2),
    textAlign: 'center',
  },
  startingVideoInfrastructureProgress: {
    marginTop: theme.spacing(2),
    width: 100,
  },
  chat: {
    backgroundColor: theme.palette.common.white,
    height: '100%',
    [theme.breakpoints.down('xs')]: {
      height: 260,
    },
  },
  tools: {
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: `0 ${theme.spacing(2)}px`,
    },
  },
  howTo: {
    padding: `${theme.spacing(4)}px ${theme.spacing(4)}px`,
    [theme.breakpoints.down('xs')]: {
      padding: `${theme.spacing(3)}px ${theme.spacing(3)}px`,
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
    isPublishingStream,
    awsMediaLiveChannelId,
    liveVideoInfrastructureError,
  } = currentUser ?? {};

  const [liveVideoIsActive, liveVideoIsActiveQuery] = useLiveVideo({
    user: currentUser,
  });
  const [, showsQuery, activeShow] = useShowsForUser(currentUser?.id);

  if (!currentUser) {
    return (
      <Container disableGutters maxWidth={false}>
        <Grid container direction="row" className={classes.artistInfoContainer}>
          <Typography color="secondary">Loading...</Typography>
        </Grid>
      </Container>
    );
  }

  const renderStreamPreviewMessage = () => {
    if (liveVideoIsActiveQuery.loading) {
      return null;
    } else if (isPublishingStream && liveVideoInfrastructureError) {
      return (
        <Typography variant="body1" className={classes.streamPreviewMessage}>
          Error starting live video infrastructure. Please restart your
          broadcast on your encoder.
        </Typography>
      );
    } else {
      return (
        <>
          <Typography variant="body1" className={classes.streamPreviewMessage}>
            {!isPublishingStream && 'No stream detected'}
            {isPublishingStream && 'Stream detected!'}
            <br />
            {isPublishingStream &&
              !liveVideoIsActive &&
              'Activating video infrastructure... '}
            {isPublishingStream &&
              !liveVideoIsActive &&
              !awsMediaLiveChannelId &&
              '(takes a minute or two at first)'}
          </Typography>
          {isPublishingStream && (
            <CircularProgress
              color="secondary"
              className={classes.startingVideoInfrastructureProgress}
            />
          )}
        </>
      );
    }
  };

  const renderActiveShowText = () => {
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
  };

  return (
    <>
      <DashboardSubheader />

      <Container disableGutters maxWidth={false}>
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
            <Typography color="textSecondary">
              {renderActiveShowText()}
            </Typography>
          </Grid>
        </Grid>

        <Paper elevation={3}>
          <DashboardModeSwitcher />
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
              {liveVideoIsActive && isPublishingStream ? (
                <LiveVideoArea />
              ) : (
                renderStreamPreviewMessage()
              )}
            </Grid>
            <Grid item container xs={false} sm={4} className={classes.chat}>
              <ChatBox userId={id} />
            </Grid>
          </Grid>
        </Paper>

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
      </Container>
    </>
  );
};

export default Dashboard;
