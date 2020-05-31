import { useQuery, gql, QueryResult } from '@apollo/client';
import { User } from '../../../api/src/entities/User';

interface UseCurrentUserOptions {
  pollInterval?: number;
}

const GET_CURRENT_USER = gql`
  {
    getCurrentUser {
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
      stripeCustomerId
      stripeAccountId
    }
  }
`;

const useCurrentUser = (
  options?: UseCurrentUserOptions
): [User | undefined, QueryResult<User>] => {
  const currentUserQuery = useQuery(GET_CURRENT_USER, {
    ...options,
  });

  return [currentUserQuery.data?.getCurrentUser, currentUserQuery];
};

export default useCurrentUser;
