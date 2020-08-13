import { useEffect } from 'react';
import { useQuery, gql, QueryResult } from '@apollo/client';
import { User } from 'types';

const GET_CURRENT_USER = gql`
  {
    getCurrentUser {
      id
      email
      username
      urlSlug
      isAllowedToStream
      streamKey
      isPublishingStream
      isInPublicMode
      liveVideoInfrastructureError
      awsMediaLiveInputId
      awsMediaLiveChannelId
      awsMediaPackageChannelId
      awsMediaPackageOriginEndpointUrl
      profileImageUrl
      stripeCustomerId
      stripeAccountId
    }
  }
`;

const USER_EVENT_SUBSCRIPTION = gql`
  subscription NewUserEvent($userId: Int) {
    newUserEvent(userId: $userId) {
      id
      email
      username
      urlSlug
      streamKey
      isPublishingStream
      isInPublicMode
      liveVideoInfrastructureError
      awsMediaLiveInputId
      awsMediaLiveChannelId
      awsMediaPackageChannelId
      awsMediaPackageOriginEndpointUrl
      profileImageUrl
      stripeCustomerId
      stripeAccountId
    }
  }
`;

interface UseCurrentUserArgs {
  subscribe?: boolean;
}

const useCurrentUser = ({ subscribe = false }: UseCurrentUserArgs = {}): [
  User | undefined,
  QueryResult<User>
] => {
  const currentUserQuery = useQuery(GET_CURRENT_USER);
  const { data, subscribeToMore } = currentUserQuery;
  const currentUser = data?.getCurrentUser;

  useEffect(() => {
    if (!currentUser || !subscribe) {
      return;
    }

    const unsubscribe = subscribeToMore({
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
