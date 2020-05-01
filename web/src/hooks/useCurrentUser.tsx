import { useQuery, gql, QueryResult } from '@apollo/client';
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

const useCurrentUser = (): [User | undefined, QueryResult<User>] => {
  const queryResult = useQuery(GET_CURRENT_USER);

  return [queryResult.data?.getCurrentUser, queryResult];
};

export default useCurrentUser;
