import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Grid, Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

interface ChatMessageProps {
  userImageUrl: string;
  userUrlSlug: string;
  username: string;
  message?: string;
}

const useStyles = makeStyles((theme) => ({
  container: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  userImage: {
    borderRadius: 20,
    height: 40,
    marginRight: theme.spacing(1),
    backgroundSize: 'cover',
    width: 40,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
}));

const ChatMessage = (props: ChatMessageProps) => {
  const classes = useStyles();

  return (
    <Grid container direction="row" className={classes.container}>
      <Grid
        item
        className={classes.userImage}
        style={{ backgroundImage: `url(${props.userImageUrl})` }}
      />
      <Grid item className={classes.textContainer}>
        <Link
          variant="body1"
          component={RouterLink}
          to={props.userUrlSlug}
          color="textPrimary"
        >
          {props.username}
        </Link>
        <Typography variant="body1" color="textSecondary">
          {props.message}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ChatMessage;
