import React, { useState, useEffect } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import {
  Paper,
  Grid,
  Container,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import DashboardSubheader from 'components/DashboardSubheader';
import LiveVideoPlayer from 'components/LiveVideoPlayer';
import TextButton from 'components/TextButton';
import ChatBox from 'components/ChatBox';
import HowToBroadcast from 'components/HowToBroadcast';

const GET_USER_PUBLISHING_STREAM_STATUS = gql`
  {
    getCurrentUser {
      urlSlug
      isPublishingStream
      liveVideoInfrastructureError
      awsMediaPackageOriginEndpointUrl
    }
  }
`;
const CHECK_USER_IS_STREAMING_LIVE = gql`
  {
    checkUserIsStreamingLive
  }
`;

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
    height: 72,
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(2),
    },
  },
  artistText: {
    flexDirection: 'column',
  },
  streamStatusBanner: {
    backgroundColor: theme.palette.common.white,
    padding: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center',
    },
  },
  previewModeColorBand: {
    backgroundColor: theme.palette.warning.main,
    height: 3,
  },
  publicModeColorBand: {
    backgroundColor: theme.palette.success.main,
    height: 3,
  },
  switchStreamModeButton: {
    marginLeft: theme.spacing(2),
  },
  videoChatContainer: {
    height: 520,
  },
  video: {
    backgroundColor: theme.palette.common.black,
    backgroundSize: 'cover',
    maxHeight: 520,
    minHeight: 250,
  },
  streamPreviewMessage: {
    color: theme.palette.common.white,
    marginRight: theme.spacing(2),
  },
  startingVideoInfrastructureProgress: {
    marginTop: theme.spacing(2),
    width: 100,
  },
  chat: {
    backgroundColor: theme.palette.common.white,
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

  const [getPublishingStreamStatus, publishingStreamStatusQuery] = useLazyQuery(
    GET_USER_PUBLISHING_STREAM_STATUS,
    {
      pollInterval: 3000,
    }
  );
  const {
    urlSlug,
    isPublishingStream,
    liveVideoInfrastructureError,
    awsMediaPackageOriginEndpointUrl,
  } = publishingStreamStatusQuery.data?.getCurrentUser || {};

  const [checkIsStreamingLive, isStreamingLiveQuery] = useLazyQuery(
    CHECK_USER_IS_STREAMING_LIVE,
    {
      pollInterval: 10000,
    }
  );
  const userIsStreamingLive =
    isStreamingLiveQuery.data?.checkUserIsStreamingLive;

  let isMounted = true;
  useEffect(() => {
    if (isMounted) {
      getPublishingStreamStatus();
      checkIsStreamingLive();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const [isPublicMode, setIsPublicMode] = useState(false);

  const renderStreamPreviewMessage = () => {
    const { loading } = publishingStreamStatusQuery;

    if (isPublishingStream && liveVideoInfrastructureError) {
      return (
        <Typography variant="body1" className={classes.streamPreviewMessage}>
          Error starting live video infrastructure. Please restart your
          broadcast on your encoder.
        </Typography>
      );
    }

    return (
      <>
        <Typography variant="body1" className={classes.streamPreviewMessage}>
          {!isPublishingStream && !loading && 'No stream detected'}
          {isPublishingStream &&
            !awsMediaPackageOriginEndpointUrl &&
            'Stream detected! Starting up video infrastructure... (takes about 60 seconds)'}
        </Typography>
        {isPublishingStream && (
          <CircularProgress
            color="secondary"
            className={classes.startingVideoInfrastructureProgress}
          />
        )}
      </>
    );
  };

  return (
    <>
      <DashboardSubheader />

      <Container disableGutters maxWidth={false}>
        <Grid container direction="row" className={classes.artistInfoContainer}>
          <img
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.daytonlocal.com%2Fimages%2Fmusic%2Fdayton-celtic-festival-gaelic-storm.jpg&f=1&nofb=1"
            alt="User"
            className={classes.artistImage}
          />
          <Grid item className={classes.artistText}>
            <Typography variant="h6">Paul Bigelow</Typography>
            <Typography color="textSecondary">
              Today at 7pm: Covers and Improv
            </Typography>
          </Grid>
        </Grid>

        <Paper elevation={3}>
          <Grid
            className={
              isPublicMode
                ? classes.publicModeColorBand
                : classes.previewModeColorBand
            }
          />
          <Grid
            container
            justify="center"
            alignItems="center"
            className={classes.streamStatusBanner}
          >
            <Typography>
              {isPublicMode
                ? "You're in public mode (everyone can see your stream)"
                : "You're in private mode (nobody can see your stream)"}
            </Typography>
            <TextButton
              onClick={() => setIsPublicMode(!isPublicMode)}
              className={classes.switchStreamModeButton}
            >
              {`Switch to ${isPublicMode ? 'private' : 'public'}`}
            </TextButton>
          </Grid>
          <Grid
            container
            direction="row"
            className={classes.videoChatContainer}
          >
            <Grid
              item
              container
              xs={12}
              sm={8}
              md={9}
              direction="column"
              justify="center"
              alignItems="center"
              className={classes.video}
            >
              {userIsStreamingLive ? (
                <LiveVideoPlayer hlsUrl={awsMediaPackageOriginEndpointUrl} />
              ) : (
                renderStreamPreviewMessage()
              )}
            </Grid>
            <Grid
              item
              container
              xs={false}
              sm={4}
              md={3}
              lg={3}
              className={classes.chat}
            >
              <ChatBox urlSlug={urlSlug} />
            </Grid>
          </Grid>
        </Paper>

        <Grid
          container
          item
          direction="column"
          xs={12}
          md={9}
          className={classes.howTo}
        >
          <HowToBroadcast />
        </Grid>
      </Container>
    </>
  );
};

export default Dashboard;
