import { useEffect } from 'react';
import { useQuery, gql, QueryResult } from '@apollo/client';
import { User } from 'types';

interface UserArgs {
  id?: number;
  urlSlug?: string;
  subscribe?: boolean;
}

const GET_USER = gql`
  query GetUser($id: Int, $urlSlug: String) {
    getUser(data: { id: $id, urlSlug: $urlSlug }) {
      id
      username
      urlSlug
      profileImageUrl
      isAllowedToStream
      isPublishingStream
      lastPublishedStreamEndTimestamp
      isInPublicMode
      awsMediaPackageOriginEndpointUrl
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
      profileImageUrl
      isAllowedToStream
      isPublishingStream
      lastPublishedStreamEndTimestamp
      isInPublicMode
      awsMediaPackageOriginEndpointUrl
      stripeConnectAccountId
    }
  }
`;

const useUser = ({
  id,
  urlSlug,
  subscribe = false,
}: UserArgs): [User | undefined, QueryResult<User>] => {
  const getUserQuery = useQuery(GET_USER, {
    variables: { id, urlSlug },
    skip: !id && !urlSlug,
  });
  const { subscribeToMore } = getUserQuery;

  useEffect(() => {
    if ((!id && !urlSlug) || !subscribe) {
      return;
    }

    const unsubscribe = subscribeToMore({
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
  }, [id, urlSlug, subscribe, subscribeToMore]);

  return [getUserQuery.data?.getUser, getUserQuery];
};

export default useUser;
