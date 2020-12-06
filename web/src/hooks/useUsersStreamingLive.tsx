import { useQuery, gql, QueryHookOptions, QueryResult } from '@apollo/client';
import { User } from 'types';

export const GET_USERS_STREAMING_LIVE = gql`
  query GetUsersStreamingLive {
    getUsersStreamingLive {
      id
      username
      urlSlug
      profileImageUrl
    }
  }
`;

interface UsersStreamingLiveData {
  getUsersStreamingLive: User[];
}

const useUsersStreamingLive = (
  queryOptions?: QueryHookOptions
): [User[] | undefined, QueryResult<UsersStreamingLiveData>] => {
  const getUsersStreamingLiveQuery = useQuery<UsersStreamingLiveData>(
    GET_USERS_STREAMING_LIVE,
    queryOptions
  );

  const usersStreamingLive =
    getUsersStreamingLiveQuery.data?.getUsersStreamingLive;

  return [usersStreamingLive, getUsersStreamingLiveQuery];
};

export default useUsersStreamingLive;
