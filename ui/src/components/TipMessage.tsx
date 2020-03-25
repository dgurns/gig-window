import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Grid, Link, Typography } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

interface TipMessageProps {
  imageUrl: string;
  profileUrl: string;
  username: string;
  tipAmount: number;
}

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1)
  },
  userImage: {
    borderRadius: 20,
    height: 40,
    marginRight: theme.spacing(1),
    backgroundSize: 'cover',
    width: 40
  },
  username: {
    color: green[500]
  },
  tipMessage: {
    color: green[500],
    display: 'inline',
    flex: 1
  }
}));

const TipMessage = (props: TipMessageProps) => {
  const classes = useStyles();

  return (
    <Grid container direction="row" className={classes.container}>
      <Grid
        item
        className={classes.userImage}
        style={{ backgroundImage: `url(${props.imageUrl})` }}
      />
      <Typography variant="body1" className={classes.tipMessage}>
        <Link
          variant="body1"
          component={RouterLink}
          to="/"
          className={classes.username}
        >
          {props.username}
        </Link>{' '}
        tipped ${props.tipAmount}!
      </Typography>
    </Grid>
  );
};

export default TipMessage;
