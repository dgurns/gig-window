import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Link, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Subheader from 'components/Subheader';

const useStyles = makeStyles(theme => ({
  pageContent: {
    paddingTop: 35,
    width: '100%'
  },
  subheaderLink: {
    margin: '0 20px',
    [theme.breakpoints.down('xs')]: {
      margin: '10px 20px'
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
  watchChatContainer: {
    height: 520
  },
  watch: {
    backgroundColor: theme.palette.common.black,
    backgroundSize: 'cover'
  },
  chat: {
    backgroundColor: theme.palette.common.white
  }
}));

const Artist = () => {
  const classes = useStyles();

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
      </Subheader>
      <Container disableGutters maxWidth={false}>
        <Grid container direction="row" className={classes.artistInfoContainer}>
          <img
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.daytonlocal.com%2Fimages%2Fmusic%2Fdayton-celtic-festival-gaelic-storm.jpg&f=1&nofb=1"
            alt="Artist"
            className={classes.artistImage}
          />
          <Grid item className={classes.artistText}>
            <Typography variant="h6">Paul Bigelow</Typography>
            <Typography variant="body1" color="textSecondary">
              Today at 7pm: Covers and Improv
            </Typography>
          </Grid>
        </Grid>
        <Grid container direction="row" className={classes.watchChatContainer}>
          <Grid item xs={12} sm={8} md={9} lg={9} className={classes.watch} />
          <Grid item xs={false} sm={4} md={3} lg={3} className={classes.chat} />
        </Grid>
      </Container>
    </>
  );
};

export default Artist;
