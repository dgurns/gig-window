import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { Grid, TextField, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import FontSizeIcon from '@material-ui/icons/FormatSize';

import useCurrentUser from 'hooks/useCurrentUser';
import useChat from 'hooks/useChat';

import ChatMessage from 'components/ChatMessage';
import TipMessage from 'components/TipMessage';
import EmojiPicker from 'components/EmojiPicker';

const useStyles = makeStyles(({ spacing, palette }) => ({
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
  fontSizeToggle: {
    backgroundColor: palette.common.white,
    color: palette.secondary.main,
    cursor: 'pointer',
    bottom: spacing(1),
    left: spacing(1),
    position: 'absolute',
    '&:hover': {
      color: palette.secondary.dark,
    },
  },
  emojiPicker: {
    bottom: 0,
    position: 'absolute',
    right: 0,
  },
}));

interface Props {
  userId?: number;
  shouldShowFontSizeToggle?: boolean;
}

const ChatBox = ({ userId, shouldShowFontSizeToggle = false }: Props) => {
  const classes = useStyles();
  const chatsRef = useRef<HTMLDivElement>(null);
  const chatsHeight = chatsRef.current?.scrollHeight ?? 0;

  const isMobile = useMediaQuery<Theme>((theme) =>
    theme.breakpoints.down('xs')
  );

  const [currentUser] = useCurrentUser();
  const [chatEvents, sendChat] = useChat(userId);

  const [inputMessage, setInputMessage] = useState('');
  const [isLargeFontSize, setIsLargeFontSize] = useState(false);

  useEffect(() => {
    if (chatsRef.current) {
      chatsRef.current.scrollTo({
        top: chatsRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatsRef, chatsHeight, chatEvents.length]);

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

  const memoizedChatEvents = useMemo(
    () =>
      chatEvents.map((chatEvent, index) => {
        const { chat, payment } = chatEvent;
        if (chat) {
          return (
            <ChatMessage
              chat={chat}
              isLargeFontSize={isLargeFontSize}
              key={index}
            />
          );
        } else if (payment) {
          return (
            <TipMessage
              payment={payment}
              isLargeFontSize={isLargeFontSize}
              key={index}
            />
          );
        } else {
          return null;
        }
      }),
    [chatEvents, isLargeFontSize]
  );

  const onFontSizeToggled = useCallback(() => {
    setIsLargeFontSize(!isLargeFontSize);
  }, [isLargeFontSize]);

  return (
    <Grid container className={classes.container}>
      <Grid item className={classes.chats} ref={chatsRef}>
        {memoizedChatEvents}
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
        {shouldShowFontSizeToggle && !isMobile && (
          <FontSizeIcon
            onClick={onFontSizeToggled}
            color="secondary"
            className={classes.fontSizeToggle}
          />
        )}
        <EmojiPicker
          onEmojiPicked={onEmojiPicked}
          className={classes.emojiPicker}
        />
      </Grid>
    </Grid>
  );
};

export default ChatBox;
