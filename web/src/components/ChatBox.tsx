import React from 'react';
import { Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import ChatMessage from 'components/ChatMessage';
import TipMessage from 'components/TipMessage';

const useStyles = makeStyles(theme => ({
  container: {
    flexDirection: 'column',
    minHeight: '100%'
  },
  chats: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    maxHeight: 421,
    overflowY: 'scroll',
    padding: theme.spacing(1),
    paddingTop: 0
  },
  textInput: {
    margin: theme.spacing(1)
  }
}));

const ChatBox = () => {
  const classes = useStyles();

  return (
    <Grid container className={classes.container}>
      <Grid item className={classes.chats}>
        <TipMessage
          imageUrl="http://images.askmen.com/fashion/trends_500/512b_hairstyles-for-bald-men.jpg"
          profileUrl="/"
          username="Bob McBlob"
          tipAmount={10}
        />
        <ChatMessage
          imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/SandraBullockMay09.jpg/120px-SandraBullockMay09.jpg"
          profileUrl="/"
          username="Sandra Bullock"
          message="I want to watch it again. It was so good the first time I would watch it a second time."
        />
        <ChatMessage
          imageUrl="http://images.askmen.com/fashion/trends_500/512b_hairstyles-for-bald-men.jpg"
          profileUrl="/"
          username="My username is super long why is it so long"
          message="What an amazing show"
        />
        <ChatMessage
          imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/SandraBullockMay09.jpg/120px-SandraBullockMay09.jpg"
          profileUrl="/"
          username="Sandra Bullock"
          message="I want to watch it again"
        />
      </Grid>
      <TextField
        placeholder="Your message here..."
        multiline
        rows="3"
        variant="outlined"
        className={classes.textInput}
      />
    </Grid>
  );
};

export default ChatBox;
