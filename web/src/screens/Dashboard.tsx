import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { Paper, Container, Link, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Subheader from 'components/Subheader';
import TextButton from 'components/TextButton';
import ChatBox from 'components/ChatBox';

const LOG_OUT = gql`
  mutation LogOut {
    logOut
  }
`;

const useStyles = makeStyles(theme => ({
  pageContent: {
    paddingTop: 35,
    width: '100%'
  },
  subheaderLink: {
    margin: `0 ${theme.spacing(3)}px`,
    [theme.breakpoints.down('xs')]: {
      margin: `${theme.spacing(1)}px ${theme.spacing(3)}px`
    }
  },
  artistInfoContainer: {
    alignItems: 'center',
    padding: `${theme.spacing(4)}px ${theme.spacing(4)}px`,
    [theme.breakpoints.down('xs')]: {
      alignItems: 'flex-start',
      flexDirection: 'column-reverse',
      padding: `${theme.spacing(3)}px ${theme.spacing(3)}px`
    }
  },
  artistImage: {
    height: 72,
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(2)
    }
  },
  artistText: {
    flexDirection: 'column'
  },
  streamStatusBanner: {
    backgroundColor: theme.palette.common.white,
    padding: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center'
    }
  },
  previewModeColorBand: {
    backgroundColor: theme.palette.warning.main,
    height: 3
  },
  publicModeColorBand: {
    backgroundColor: theme.palette.success.main,
    height: 3
  },
  switchStreamModeButton: {
    marginLeft: theme.spacing(2)
  },
  videoChatContainer: {
    height: 520
  },
  video: {
    backgroundColor: theme.palette.common.black,
    backgroundSize: 'cover',
    minHeight: 250
  },
  streamPreviewMessage: {
    color: theme.palette.common.white
  },
  chat: {
    backgroundColor: theme.palette.common.white
  },
  tools: {
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: `0 ${theme.spacing(2)}px`
    }
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  const [logOut, { data }] = useMutation(LOG_OUT, {
    errorPolicy: 'all'
  });

  useEffect(() => {
    if (data?.logOut) {
      window.location.reload();
    }
  }, [data]);

  const [isPublicMode, setIsPublicMode] = useState(false);

  return (
    <>
      <Subheader>
        <Link
          to="/"
          variant="body1"
          component={RouterLink}
          className={classes.subheaderLink}
        >
          Edit profile
        </Link>
        <Link
          to="/"
          variant="body1"
          component={RouterLink}
          className={classes.subheaderLink}
        >
          Schedule show
        </Link>
        <Link
          to="/"
          variant="body1"
          component={RouterLink}
          className={classes.subheaderLink}
        >
          Edit shows
        </Link>
        <Link
          to="/"
          variant="body1"
          component={RouterLink}
          className={classes.subheaderLink}
        >
          Transactions
        </Link>
        <TextButton onClick={() => logOut()} className={classes.subheaderLink}>
          Log out
        </TextButton>
      </Subheader>
      <Container disableGutters maxWidth={false}>
        <Grid container direction="row" className={classes.artistInfoContainer}>
          <img
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.daytonlocal.com%2Fimages%2Fmusic%2Fdayton-celtic-festival-gaelic-storm.jpg&f=1&nofb=1"
            alt="User"
            className={classes.artistImage}
          />
          <Grid item className={classes.artistText}>
            <Typography variant="h6">Paul Bigelow</Typography>
            <Typography variant="body1" color="textSecondary">
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
            <Typography variant="body1">
              {isPublicMode
                ? 'You are broadcasting live in public mode'
                : "Preview your stream in private mode (your fans won't be able to see)"}
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
      </Container>
    </>
  );
};

export default Dashboard;
