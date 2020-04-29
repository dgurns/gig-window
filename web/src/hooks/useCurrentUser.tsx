import { useEffect } from 'react';
import { useLazyQuery, gql, ApolloError } from '@apollo/client';
import { User } from '../../../api/src/entities/User';

const GET_CURRENT_USER = gql`
  {
    getCurrentUser {
      id
      email
      username
      urlSlug
      streamKey
      isPublishingStream
      liveVideoInfrastructureError
      awsMediaLiveInputId
      awsMediaLiveChannelId
      awsMediaPackageChannelId
    }
  }
`;

const useCurrentUser = (): [
  User | undefined,
  boolean,
  ApolloError | undefined
] => {
  const [getCurrentUser, { data, loading, error }] = useLazyQuery(
    GET_CURRENT_USER
  );

  let isMounted = true;
  useEffect(() => {
    if (isMounted) {
      getCurrentUser();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  let currentUser;
  if (data?.getCurrentUser) {
    currentUser = data.getCurrentUser;
  }

  return [currentUser, loading, error];
};

export default useCurrentUser;
