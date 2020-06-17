import React, { useState, useEffect, useRef } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { Chat } from '../../../api/src/entities/Chat';
import useCurrentUser from 'hooks/useCurrentUser';
import useChat from 'hooks/useChat';

import ChatMessage from 'components/ChatMessage';

interface ChatBoxProps {
  userId?: number;
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
  const chatsRef = useRef<HTMLDivElement>(null);

  const [currentUser] = useCurrentUser();
  const [chatEvents, sendChat] = useChat(props.userId);

  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    if (chatsRef.current) {
      chatsRef.current.scrollTo({
        top: chatsRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatEvents.length, chatsRef]);

  const onInputMessageChanged = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => setInputMessage(event.target.value);

  const onKeyPressed = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (!currentUser) {
        return window.alert('You need to log in or sign up to chat');
      } else if (!inputMessage) {
        return window.alert('No message entered');
      }

      sendChat(inputMessage);
      setInputMessage('');
    }
  };

  const renderChatEvent = (chatEvent: Chat, index: number) => {
    const { message, user } = chatEvent;
    if (message) {
      return <ChatMessage user={user} message={message} key={index} />;
    }
  };

  return (
    <Grid container className={classes.container}>
      <Grid item className={classes.chats} ref={chatsRef}>
        {chatEvents.map(renderChatEvent)}
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
