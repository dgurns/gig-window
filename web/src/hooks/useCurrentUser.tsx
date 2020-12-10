import { useEffect } from 'react';
import { useQuery, gql, QueryResult } from '@apollo/client';
import { User } from 'types';

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      id
      permissions
      email
      username
      urlSlug
      aboutMarkdown
      isAllowedToStream
      isInPublicMode
      muxStreamKey
      muxPlaybackId
      muxLiveStreamStatus
      profileImageUrl
      stripeCustomerId
      stripeConnectAccountId
    }
  }
`;

const USER_EVENT_SUBSCRIPTION = gql`
  subscription NewUserEvent($userId: Int) {
    newUserEvent(userId: $userId) {
      id
      permissions
      email
      username
      urlSlug
      aboutMarkdown
      isAllowedToStream
      isInPublicMode
      muxStreamKey
      muxPlaybackId
      muxLiveStreamStatus
      profileImageUrl
      stripeCustomerId
      stripeConnectAccountId
    }
  }
`;

interface UseCurrentUserArgs {
  subscribe?: boolean;
}

interface QueryData {
  getCurrentUser: User;
}
interface SubscriptionData {
  newUserEvent: User;
}
interface SubscriptionVars {
  userId: number;
}

const useCurrentUser = ({ subscribe = false }: UseCurrentUserArgs = {}): [
  User | undefined,
  QueryResult<QueryData>
] => {
  const currentUserQuery = useQuery<QueryData>(GET_CURRENT_USER);

  const { data, subscribeToMore } = currentUserQuery;
  const currentUser = data?.getCurrentUser;

  useEffect(() => {
    if (!currentUser || !subscribe || !subscribeToMore) {
      return;
    }

    const unsubscribe = subscribeToMore<SubscriptionData, SubscriptionVars>({
      document: USER_EVENT_SUBSCRIPTION,
      variables: { userId: currentUser.id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const { newUserEvent } = subscriptionData.data;
        return Object.assign({}, prev, {
          getCurrentUser: newUserEvent,
        });
      },
    });
    return () => unsubscribe();
  }, [currentUser, subscribe, subscribeToMore]);

  return [currentUser, currentUserQuery];
};

export default useCurrentUser;
