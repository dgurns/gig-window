import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Grid, Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Chat } from 'types';

interface ChatMessageProps {
  chat: Chat;
}

const useStyles = makeStyles(({ spacing, palette }) => ({
  container: {
    marginBottom: spacing(1),
    marginTop: spacing(1),
  },
  userImage: {
    borderRadius: 20,
    height: 40,
    marginRight: spacing(1),
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    width: 40,
  },
  userImagePlaceholder: {
    backgroundColor: palette.background.default,
    borderRadius: 20,
    height: 40,
    marginRight: spacing(1),
    width: 40,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    marginTop: -5,
  },
}));

const ChatMessage = ({ chat }: ChatMessageProps) => {
  const classes = useStyles();

  if (!chat) {
    return null;
  }

  const { user, message } = chat;

  return (
    <Grid container direction="row" className={classes.container}>
      <RouterLink to={user.urlSlug}>
        {user.profileImageUrl ? (
          <Grid
            item
            className={classes.userImage}
            style={{ backgroundImage: `url(${user.profileImageUrl})` }}
          />
        ) : (
          <Grid item className={classes.userImagePlaceholder} />
        )}
      </RouterLink>
      <Grid item className={classes.textContainer}>
        <Link
          variant="body1"
          component={RouterLink}
          to={user.urlSlug}
          color="textPrimary"
        >
          {user.username}
        </Link>
        <Typography variant="body1" color="textSecondary">
          {message}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ChatMessage;
