import React, { useState } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';
import useChat from 'hooks/useChat';
import { Message, MessageType, Chat } from 'types/Message';

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
    if (event.key === 'Enter') {
      event.preventDefault();

      if (!currentUser) {
        return window.alert('You need to log in to chat');
      }

      const message = new Chat(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/SandraBullockMay09.jpg/120px-SandraBullockMay09.jpg',
        currentUser.urlSlug,
        currentUser.username,
        inputMessage
      );
      sendMessage(message);
      setInputMessage('');
    }
  };

  const renderMessage = (message: Message, index: number) => {
    if (message.type === MessageType.Chat) {
      return (
        <ChatMessage
          userImageUrl={message.userImageUrl}
          userUrlSlug={message.userUrlSlug}
          username={message.username}
          message={message.message}
          key={index}
        />
      );
    } else if (message.type === MessageType.Tip && message.tipAmount) {
      return (
        <TipMessage
          userImageUrl={message.userImageUrl}
          userUrlSlug={message.userUrlSlug}
          username={message.username}
          tipAmount={message.tipAmount}
          key={index}
        />
      );
    }
  };

  return (
    <Grid container className={classes.container}>
      <Grid item className={classes.chats}>
        {messages.map(renderMessage)}
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
