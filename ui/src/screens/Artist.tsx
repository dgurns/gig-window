import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Paper,
  Container,
  Link,
  TextField,
  InputAdornment,
  Button,
  Typography,
  Grid
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Subheader from 'components/Subheader';

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
  },
  tipInput: {
    marginRight: theme.spacing(1),
    width: 56
  },
  tipInputStartAdornment: {
    paddingLeft: 7
  },
  tipInputInterior: {
    marginBottom: 1,
    marginLeft: -3,
    paddingRight: 0
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
        <Paper elevation={3}>
          <Grid
            container
            direction="row"
            className={classes.watchChatContainer}
          >
            <Grid item xs={12} sm={8} md={9} className={classes.watch} />
            <Grid
              item
              xs={false}
              sm={4}
              md={3}
              lg={3}
              className={classes.chat}
            />
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
            <TextField
              defaultValue="3"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
                classes: {
                  adornedStart: classes.tipInputStartAdornment,
                  input: classes.tipInputInterior
                }
              }}
              size="small"
              variant="outlined"
              className={classes.tipInput}
            />
            <Button variant="contained" color="primary" size="small">
              Tip
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Artist;
