import { useEffect } from 'react';
import { useQuery, gql, QueryResult } from '@apollo/client';
import { User } from 'types';

const GET_USER = gql`
  query GetUser($id: Int, $urlSlug: String) {
    getUser(data: { id: $id, urlSlug: $urlSlug }) {
      id
      username
      urlSlug
      aboutMarkdown
      profileImageUrl
      isAllowedToStream
      isInPublicMode
      muxPlaybackId
      muxLiveStreamStatus
      stripeConnectAccountId
    }
  }
`;

const USER_EVENT_SUBSCRIPTION = gql`
  subscription NewUserEvent($userId: Int, $userUrlSlug: String) {
    newUserEvent(userId: $userId, userUrlSlug: $userUrlSlug) {
      id
      username
      urlSlug
      aboutMarkdown
      profileImageUrl
      isAllowedToStream
      isInPublicMode
      muxPlaybackId
      muxLiveStreamStatus
      stripeConnectAccountId
    }
  }
`;

interface QueryData {
  getUser: User;
}
interface QueryVars {
  id?: number;
  urlSlug?: string;
}
interface SubscriptionData {
  newUserEvent: User;
}
interface SubscriptionVars {
  userId?: number;
  userUrlSlug?: string;
}

interface UseUserArgs {
  id?: number;
  urlSlug?: string;
  subscribe?: boolean;
}

const useUser = ({
  id,
  urlSlug,
  subscribe = false,
}: UseUserArgs): [User | undefined, QueryResult<QueryData, QueryVars>] => {
  const getUserQuery = useQuery<QueryData, QueryVars>(GET_USER, {
    variables: { id, urlSlug },
    skip: !id && !urlSlug,
  });

  const { subscribeToMore } = getUserQuery;

  useEffect(() => {
    if (!subscribe || !subscribeToMore || (!id && !urlSlug)) {
      return;
    }

    const unsubscribe = subscribeToMore<SubscriptionData, SubscriptionVars>({
      document: USER_EVENT_SUBSCRIPTION,
      variables: { userId: id, userUrlSlug: urlSlug },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const { newUserEvent } = subscriptionData.data;
        return Object.assign({}, prev, {
          getUser: newUserEvent,
        });
      },
    });

    return () => unsubscribe();
  }, [subscribe, subscribeToMore, id, urlSlug]);

  return [getUserQuery.data?.getUser, getUserQuery];
};

export default useUser;
