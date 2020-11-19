import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Grid, TextField, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import useCurrentUser from 'hooks/useCurrentUser';
import useChat, { ChatEvent } from 'hooks/useChat';

import ChatMessage from 'components/ChatMessage';
import TipMessage from 'components/TipMessage';
import EmojiPicker from 'components/EmojiPicker';

interface ChatBoxProps {
  userId?: number;
}

const useStyles = makeStyles(({ spacing }) => ({
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
    padding: spacing(1),
    paddingTop: 0,
  },
  textInput: {
    margin: spacing(1),
    position: 'relative',
  },
  emojiPicker: {
    bottom: 0,
    position: 'absolute',
    right: 0,
  },
}));

const ChatBox = (props: ChatBoxProps) => {
  const classes = useStyles();
  const chatsRef = useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery<Theme>((theme) =>
    theme.breakpoints.down('xs')
  );

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

  const onInputMessageChanged = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) =>
      setInputMessage(event.target.value),
    []
  );

  const onKeyPressed = useCallback(
    async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
    },
    [currentUser, inputMessage, sendChat]
  );

  const onEmojiPicked = useCallback(
    (emoji) => {
      if (!currentUser) {
        return window.alert('You need to log in or sign up to chat');
      }
      sendChat(emoji);
    },
    [currentUser, sendChat]
  );

  const renderChatEvent = useCallback((chatEvent: ChatEvent, index: number) => {
    const { chat, payment } = chatEvent;
    if (chat) {
      return <ChatMessage chat={chat} key={index} />;
    } else if (payment) {
      return <TipMessage payment={payment} key={index} />;
    }
  }, []);

  return (
    <Grid container className={classes.container}>
      <Grid item className={classes.chats} ref={chatsRef}>
        {chatEvents.map(renderChatEvent)}
      </Grid>
      <Grid item className={classes.textInput}>
        <TextField
          placeholder="Your message here..."
          multiline
          rows={isMobile ? '2' : '3'}
          variant="outlined"
          value={inputMessage}
          onChange={onInputMessageChanged}
          inputProps={{
            onKeyDown: onKeyPressed,
          }}
        />
        <EmojiPicker
          onEmojiPicked={onEmojiPicked}
          className={classes.emojiPicker}
        />
      </Grid>
    </Grid>
  );
};

export default ChatBox;
