import React, { useState, useEffect } from 'react';
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

const CHAT_EVENTS_SUBSCRIPTION = gql`
  subscription ChatEventsSubscription($parentUrlSlug: String!) {
    newChatEvent(parentUrlSlug: $parentUrlSlug) {
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
  const { subscribeToMore, ...getChatEventsResult } = useQuery(
    GET_CHAT_EVENTS,
    {
      variables: { parentUrlSlug: props.urlSlug },
      skip: !props.urlSlug,
    }
  );
  const chatEvents = getChatEventsResult.data?.getChatEvents || [];
  const [createChat] = useMutation(CREATE_CHAT, {
    errorPolicy: 'all',
  });

  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    if (!props.urlSlug) return;
    const unsubscribe = subscribeToMore({
      document: CHAT_EVENTS_SUBSCRIPTION,
      variables: { parentUrlSlug: props.urlSlug },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const { newChatEvent } = subscriptionData.data;
        return Object.assign({}, prev, {
          getChatEvents: [...prev.getChatEvents, newChatEvent],
        });
      },
    });
    return () => unsubscribe();
  }, [props.urlSlug]);

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

  const renderChatEvent = (chatEvent: any, index: number) => {
    const { message, user } = chatEvent;
    if (message) {
      return (
        <ChatMessage
          userImageUrl="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FM%2FMV5BOTk1MzAzMDUxMF5BMl5BanBnXkFtZTgwODgyMTQxNjM%40._V1_UY98_CR3%2C0%2C67%2C98_AL_.jpg&f=1&nofb=1"
          userUrlSlug={user.urlSlug}
          username={user.username}
          message={message}
          key={index}
        />
      );
    }
  };

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
