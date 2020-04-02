import React from 'react';
import { Paper, Container, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import TipButton from 'components/TipButton';
import ChatBox from 'components/ChatBox';

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
  userInfoContainer: {
    alignItems: 'center',
    padding: `${theme.spacing(4)}px ${theme.spacing(4)}px`,
    [theme.breakpoints.down('xs')]: {
      alignItems: 'flex-start',
      flexDirection: 'column-reverse',
      padding: `${theme.spacing(3)}px ${theme.spacing(3)}px`
    }
  },
  userImage: {
    height: 72,
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(2)
    }
  },
  userText: {
    flexDirection: 'column'
  },
  watchChatContainer: {
    height: 520
  },
  watch: {
    backgroundColor: theme.palette.common.black,
    backgroundSize: 'cover'
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

const Watch = () => {
  const classes = useStyles();

  return (
    <Container disableGutters maxWidth={false}>
      <Grid container direction="row" className={classes.userInfoContainer}>
        <img
          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.daytonlocal.com%2Fimages%2Fmusic%2Fdayton-celtic-festival-gaelic-storm.jpg&f=1&nofb=1"
          alt="Watch"
          className={classes.userImage}
        />
        <Grid item className={classes.userText}>
          <Typography variant="h6">Paul Bigelow</Typography>
          <Typography variant="body1" color="textSecondary">
            Today at 7pm: Covers and Improv
          </Typography>
        </Grid>
      </Grid>
      <Paper elevation={3}>
        <Grid container direction="row" className={classes.watchChatContainer}>
          <Grid item xs={12} sm={8} md={9} className={classes.watch} />
          <Grid item xs={false} sm={4} md={3} lg={3} className={classes.chat}>
            <ChatBox />
          </Grid>
        </Grid>
      </Paper>
      <Grid
        container
        direction="row"
        justify="flex-start"
        className={classes.tools}
      >
        <Grid
          item
          container
          direction="row"
          xs={12}
          sm={8}
          md={9}
          justify="flex-end"
        >
          <TipButton />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Watch;