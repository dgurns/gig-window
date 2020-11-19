import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import classnames from 'classnames';
import { Grid, Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Chat } from 'types';

import { EMOJI_OPTIONS } from 'components/EmojiPicker';

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
  usernameLarge: {
    fontSize: '1.5rem',
  },
  emoji: {
    fontSize: '2.2rem',
  },
  emojiLarge: {
    fontSize: '2.9rem',
  },
}));

interface Props {
  chat: Chat;
  isLargeFontSize?: boolean;
}

const ChatMessage = ({ chat, isLargeFontSize = false }: Props) => {
  const classes = useStyles();

  if (!chat) {
    return null;
  }

  const { user, message } = chat;

  const isEmojiMessage = EMOJI_OPTIONS.indexOf(message) > -1;

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
          component={RouterLink}
          to={user.urlSlug}
          color="textPrimary"
          className={classnames({ [classes.usernameLarge]: isLargeFontSize })}
        >
          {user.username}
        </Link>
        <Typography
          color="textSecondary"
          variant={isLargeFontSize ? 'h5' : 'body1'}
          className={classnames({
            [classes.emoji]: isEmojiMessage,
            [classes.emojiLarge]: isEmojiMessage && isLargeFontSize,
          })}
        >
          {message}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ChatMessage;
