import { useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Chat } from '../../../api/src/entities/Chat';

const GET_CHAT_EVENTS = gql`
  query GetChatEvents($parentUserId: Int!) {
    getChatEvents(parentUserId: $parentUserId) {
      id
      user {
        urlSlug
        username
        profileImageUrl
      }
      message
    }
  }
`;

const CHAT_EVENTS_SUBSCRIPTION = gql`
  subscription ChatEventsSubscription($parentUserId: Int!) {
    newChatEvent(parentUserId: $parentUserId) {
      id
      user {
        urlSlug
        username
        profileImageUrl
      }
      message
    }
  }
`;

const CREATE_CHAT = gql`
  mutation CreateChat($parentUserId: Int!, $message: String!) {
    createChat(data: { parentUserId: $parentUserId, message: $message }) {
      id
      user {
        urlSlug
        username
        profileImageUrl
      }
      message
    }
  }
`;

const useChat = (
  parentUserId?: number
): [Chat[], (message?: string) => void] => {
  const { subscribeToMore, ...getChatEventsResult } = useQuery(
    GET_CHAT_EVENTS,
    {
      variables: { parentUserId },
      skip: !parentUserId,
    }
  );
  const chatEvents = getChatEventsResult.data?.getChatEvents || [];

  useEffect(() => {
    if (!parentUserId) return;

    const unsubscribe = subscribeToMore({
      document: CHAT_EVENTS_SUBSCRIPTION,
      variables: { parentUserId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const { newChatEvent } = subscriptionData.data;
        return Object.assign({}, prev, {
          getChatEvents: [...prev.getChatEvents, newChatEvent],
        });
      },
    });
    return () => unsubscribe();
  }, [parentUserId, subscribeToMore]);

  const [createChat] = useMutation(CREATE_CHAT, {
    errorPolicy: 'all',
  });

  const sendChat = (message?: string) => {
    if (!message || !parentUserId) return;

    createChat({
      variables: {
        parentUserId,
        message,
      },
    });
  };

  return [chatEvents, sendChat];
};

export default useChat;
