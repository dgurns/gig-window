import React, { useState } from 'react';
import {
  Paper,
  Grid,
  Link,
  Container,
  Typography,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import DashboardSubheader from 'components/DashboardSubheader';
import TextButton from 'components/TextButton';
import ChatBox from 'components/ChatBox';

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
    minHeight: 250,
  },
  streamPreviewMessage: {
    color: theme.palette.common.white,
    marginRight: theme.spacing(2),
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
  howToItem: {
    marginBottom: 11,
  },
  rtmpField: {
    maxWidth: 350,
  },
}));

const Dashboard = () => {
  const classes = useStyles();

  const [isPublicMode, setIsPublicMode] = useState(false);

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
              justify="center"
              alignItems="center"
              className={classes.video}
            >
              <Typography
                variant="body1"
                className={classes.streamPreviewMessage}
              >
                No stream detected
              </Typography>
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
              <ChatBox />
            </Grid>
          </Grid>
        </Paper>

        <Grid
          container
          direction="column"
          xs={12}
          md={9}
          className={classes.howTo}
        >
          <Typography variant="h6" className={classes.howToItem}>
            How to broadcast:
          </Typography>
          <Typography className={classes.howToItem}>
            1. Pick some streaming software - anything that lets you stream to
            an RTMP URL. Many people like{' '}
            <Link href="https://obsproject.com/">OBS</Link> (laptop/desktop) or{' '}
            <Link href="https://streamlabs.com/">Streamlabs</Link>{' '}
            (iOS/Android), which are free and open source. Both have plenty of
            help resources and guides for getting started.
          </Typography>
          <Typography className={classes.howToItem}>
            2. Send your stream to this custom RTMP URL:
          </Typography>
          <TextField
            value="rtmp://coronawindow.com/abc123"
            variant="outlined"
            size="small"
            className={classnames([classes.howToItem, classes.rtmpField])}
          />
          <Typography className={classes.howToItem}>
            3. When you’re broadcasting, you’ll see the stream appear above.
          </Typography>
        </Grid>
      </Container>
    </>
  );
};

export default Dashboard;
