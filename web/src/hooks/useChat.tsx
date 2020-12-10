import { useEffect, useCallback } from 'react';
import { useLazyQuery, useMutation, gql } from '@apollo/client';
import { ChatEvent } from 'types';

const GET_CHAT_EVENTS = gql`
  query GetChatEvents($parentUserId: Int!) {
    getChatEvents(parentUserId: $parentUserId) {
      chat {
        id
        user {
          urlSlug
          username
          profileImageUrl
        }
        message
      }
      payment {
        id
        user {
          urlSlug
          username
          profileImageUrl
        }
        payeeUser {
          username
        }
        amountInCents
      }
    }
  }
`;

const CHAT_EVENTS_SUBSCRIPTION = gql`
  subscription ChatEventsSubscription($parentUserId: Int!) {
    newChatEvent(parentUserId: $parentUserId) {
      chat {
        id
        user {
          urlSlug
          username
          profileImageUrl
        }
        message
      }
      payment {
        id
        user {
          urlSlug
          username
          profileImageUrl
        }
        payeeUser {
          username
        }
        amountInCents
      }
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

interface QueryData {
  getChatEvents: ChatEvent[];
}
interface SubscriptionData {
  newChatEvent: ChatEvent;
}

const useChat = (
  parentUserId?: number
): [ChatEvent[], (message?: string) => void] => {
  const [
    getChatEvents,
    { subscribeToMore, ...getChatEventsResult },
  ] = useLazyQuery<QueryData>(GET_CHAT_EVENTS);

  useEffect(() => {
    if (parentUserId) {
      getChatEvents({ variables: { parentUserId } });
    }
  }, [getChatEvents, parentUserId]);

  const chatEvents = getChatEventsResult.data?.getChatEvents || [];

  useEffect(() => {
    if (!parentUserId || !subscribeToMore) return;

    const unsubscribe = subscribeToMore<SubscriptionData>({
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

  const sendChat = useCallback(
    (message?: string) => {
      if (!message || !parentUserId) return;

      createChat({
        variables: {
          parentUserId,
          message,
        },
      });
    },
    [parentUserId, createChat]
  );

  return [chatEvents, sendChat];
};

export default useChat;
