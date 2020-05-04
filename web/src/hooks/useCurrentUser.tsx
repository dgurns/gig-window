import { useQuery, gql, QueryResult, QueryHookOptions } from '@apollo/client';
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
      liveVideoInfrastructureError
      awsMediaLiveInputId
      awsMediaLiveChannelId
      awsMediaPackageChannelId
      awsMediaPackageOriginEndpointUrl
    }
  }
`;

const useCurrentUser = (
  options?: UseCurrentUserOptions
): [User | undefined, QueryResult<User>] => {
  const queryResult = useQuery(GET_CURRENT_USER, {
    ...options,
  });

  return [queryResult.data?.getCurrentUser, queryResult];
};

export default useCurrentUser;
