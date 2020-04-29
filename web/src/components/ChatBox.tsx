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
  query GetChatEventsForParent($parentUrlSlug: String!) {
    getChatEventsForParent(parentUrlSlug: $parentUrlSlug) {
      id
      type
      user {
        id
        urlSlug
      }
      parentUser {
        id
        username
      }
      message
      tipAmount
    }
  }
`;

const CREATE_CHAT_EVENT = gql`
  mutation CreateChatEvent(
    $parentUrlSlug: String!
    $type: String!
    $message: String
  ) {
    createChatEvent(
      data: { parentUrlSlug: $parentUrlSlug, type: $type, message: $message }
    ) {
      id
      type
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
  const [
    createChatEvent,
    createChatEventResult,
  ] = useMutation(CREATE_CHAT_EVENT, { errorPolicy: 'all' });
  console.log('getChatEvents', getChatEventsResult);
  console.log('createChatEvent', createChatEventResult);

  const [inputMessage, setInputMessage] = useState('');

  const onInputMessageChanged = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => setInputMessage(event.target.value);

  const onKeyPressed = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (!currentUser) {
        return window.alert('You need to log in to chat');
      }

      createChatEvent({
        variables: {
          parentUrlSlug: props.urlSlug || '',
          type: 'message',
          message: inputMessage,
        },
      });
      setInputMessage('');
    }
  };

  // const renderChatEvent = (chatEvent) => {
  //   if (chatEvent.type === 'message') {
  //     return (
  //       <ChatMessage
  //         userImageUrl={message.userImageUrl}
  //         userUrlSlug={message.userUrlSlug}
  //         username={message.username}
  //         message={message.message}
  //         key={index}
  //       />
  //     );
  //   } else if (chatEvent.type === 'tip') {
  //     return (
  //       <TipMessage
  //         userImageUrl={message.userImageUrl}
  //         userUrlSlug={message.userUrlSlug}
  //         username={message.username}
  //         tipAmount={message.tipAmount}
  //         key={index}
  //       />
  //     );
  //   }
  // };

  return (
    <Grid container className={classes.container}>
      <Grid item className={classes.chats}></Grid>
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
