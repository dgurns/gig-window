import { useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Chat } from '../../../api/src/entities/Chat';

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

const useChat = (
  parentUrlSlug?: string
): [Chat[], (message?: string) => void] => {
  const { subscribeToMore, ...getChatEventsResult } = useQuery(
    GET_CHAT_EVENTS,
    {
      variables: { parentUrlSlug },
      skip: !parentUrlSlug,
    }
  );
  const chatEvents = getChatEventsResult.data?.getChatEvents || [];

  useEffect(() => {
    if (!parentUrlSlug) return;

    const unsubscribe = subscribeToMore({
      document: CHAT_EVENTS_SUBSCRIPTION,
      variables: { parentUrlSlug: parentUrlSlug },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const { newChatEvent } = subscriptionData.data;
        return Object.assign({}, prev, {
          getChatEvents: [...prev.getChatEvents, newChatEvent],
        });
      },
    });
    return () => unsubscribe();
  }, [parentUrlSlug, subscribeToMore]);

  const [createChat] = useMutation(CREATE_CHAT, {
    errorPolicy: 'all',
  });

  const sendChat = (message?: string) => {
    if (!message || !parentUrlSlug) return;

    createChat({
      variables: {
        parentUrlSlug,
        message,
      },
    });
  };

  return [chatEvents, sendChat];
};

export default useChat;
