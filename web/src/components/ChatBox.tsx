import React, { useState } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';
import useChat from 'hooks/useChat';

import ChatMessage from 'components/ChatMessage';
import TipMessage from 'components/TipMessage';

interface ChatBoxProps {
  urlSlug: string;
}

const useStyles = makeStyles((theme) => ({
  container: {
    flexDirection: 'column',
    height: '100%',
  },
  chats: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    maxHeight: 421,
    overflowY: 'scroll',
    padding: theme.spacing(1),
    paddingTop: 0,
  },
  textInput: {
    margin: theme.spacing(1),
  },
}));

const ChatBox = (props: ChatBoxProps) => {
  const classes = useStyles();

  const [currentUser] = useCurrentUser();
  const [messages, sendMessage] = useChat(props.urlSlug);
  const [inputMessage, setInputMessage] = useState('');

  const onInputMessageChanged = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => setInputMessage(event.target.value);

  const onKeyPressed = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!currentUser) {
      return window.alert('You need to log in to chat');
    }
    if (event.key === 'Enter') {
      event.preventDefault();

      const message = {
        userImageUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/SandraBullockMay09.jpg/120px-SandraBullockMay09.jpg',
        userUrlSlug: currentUser.urlSlug,
        username: currentUser.username,
        message: inputMessage,
      };
      sendMessage(message);
      setInputMessage('');
    }
  };

  return (
    <Grid container className={classes.container}>
      <Grid item className={classes.chats}>
        <TipMessage
          imageUrl="http://images.askmen.com/fashion/trends_500/512b_hairstyles-for-bald-men.jpg"
          profileUrl="/user20"
          username="Bob McBlob"
          tipAmount={10}
        />
        <ChatMessage
          imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/SandraBullockMay09.jpg/120px-SandraBullockMay09.jpg"
          profileUrl="/user11"
          username="Sandra Bullock"
          message="I want to watch it again. It was so good the first time I would watch it a second time."
        />
        <ChatMessage
          imageUrl="http://images.askmen.com/fashion/trends_500/512b_hairstyles-for-bald-men.jpg"
          profileUrl="/user10"
          username="My username is super long why is it so long"
          message="What an amazing show"
        />
        <ChatMessage
          imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/SandraBullockMay09.jpg/120px-SandraBullockMay09.jpg"
          profileUrl="/user3"
          username="Sandra Bullock"
          message="I want to watch it again"
        />
        {messages.length}
      </Grid>
      <TextField
        placeholder="Your message here..."
        multiline
        rows="3"
        variant="outlined"
        className={classes.textInput}
        value={inputMessage}
        onChange={onInputMessageChanged}
        inputProps={{
          onKeyDown: onKeyPressed,
        }}
      />
    </Grid>
  );
};

export default ChatBox;
