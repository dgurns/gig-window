import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import useCurrentUser from 'hooks/useCurrentUser';

import ChatMessage from 'components/ChatMessage';
import TipMessage from 'components/TipMessage';

interface ChatBoxProps {
  urlSlug: string;
}

const GET_CHAT_EVENTS = gql`
  query GetChatEvents($parentUrlSlug: String!) {
    getChatEvents(parentUrlSlug: $parentUrlSlug) {
      id
      user {
        urlSlug
        username
      }
      message
    }
  }
`;

const CREATE_CHAT = gql`
  mutation CreateChat($parentUrlSlug: String!, $message: String!) {
    createChat(data: { parentUrlSlug: $parentUrlSlug, message: $message }) {
      id
      user {
        urlSlug
        username
      }
      message
    }
  }
`;

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
  const getChatEventsResult = useQuery(GET_CHAT_EVENTS, {
    variables: { parentUrlSlug: props.urlSlug },
  });
  const [createChat, createChatResult] = useMutation(CREATE_CHAT, {
    errorPolicy: 'all',
  });

  const [inputMessage, setInputMessage] = useState('');

  const onInputMessageChanged = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => setInputMessage(event.target.value);

  const onKeyPressed = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === 'Enter' && inputMessage) {
      event.preventDefault();

      if (!currentUser) {
        return window.alert('You need to log in to chat');
      }

      createChat({
        variables: {
          parentUrlSlug: props.urlSlug || '',
          message: inputMessage,
        },
      });
      setInputMessage('');
    }
  };

  const renderChatEvent = (chatEvent: any) => {
    console.log('render chatEvent', chatEvent);
    // if (chatEvent.message) {
    // return (
    //   <ChatMessage
    //     userImageUrl={chatEvent.userImageUrl}
    //     userUrlSlug={chatEvent.userUrlSlug}
    //     username={chatEvent.username}
    //     message={message.message}
    //     key={index}
    //   />
    // );
    // }
  };

  const chatEvents = getChatEventsResult.data?.getChatEvents || [];

  return (
    <Grid container className={classes.container}>
      <Grid item className={classes.chats}>
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
