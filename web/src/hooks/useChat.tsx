import { useCallback } from 'react';
import {
  useQuery,
  useMutation,
  gql,
  QueryResult,
  MutationResult,
  MutationTuple,
} from '@apollo/client';
import { ChatEvent } from '../../../api/src/entities/ChatEvent';

interface GetChatEventsData {
  getChatEventsForParent: ChatEvent[];
}
interface GetChatEventsVars {
  parentUrlSlug: string;
}
interface CreateChatEventData {
  createChatEvent: ChatEvent;
}
interface CreateChatEventVars {
  parentUrlSlug?: string;
  type: string;
  message?: string;
  tipAmount?: number;
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
    $tipAmount: Number
  ) {
    createChatEvent(
      data: {
        parentUrlSlug: $parentUrlSlug
        type: $type
        message: $message
        tipAmount: $tipAmount
      }
    ) {
      id
      type
      user {
        id
        urlSlug
      }
      parentUser {
        id
        urlSlug
      }
      message
      tipAmount
    }
  }
`;

const useChat = (
  parentUrlSlug?: string
): [
  QueryResult<GetChatEventsData, GetChatEventsVars>,
  MutationTuple<CreateChatEventData, CreateChatEventVars>
] => {
  const getChatEventsQuery = useQuery<GetChatEventsData, GetChatEventsVars>(
    GET_CHAT_EVENTS,
    {
      variables: { parentUrlSlug: parentUrlSlug || '' },
    }
  );
  const createChatEventMutation = useMutation<CreateChatEventData>(
    CREATE_CHAT_EVENT,
    { errorPolicy: 'all' }
  );

  return [getChatEventsQuery, createChatEventMutation];
};

export default useChat;
