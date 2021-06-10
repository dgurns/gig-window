import { useEffect } from 'react';
import {
  useLazyQuery,
  gql,
  QueryHookOptions,
  LazyQueryResult,
} from '@apollo/client';
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

interface QueryData {
  getUsersStreamingLive: User[];
}

const useUsersStreamingLive = (
  queryOptions?: QueryHookOptions
): [User[] | undefined, LazyQueryResult<QueryData, {}>] => {
  const [getUsersStreamingLive, getUsersStreamingLiveQuery] = useLazyQuery<
    QueryData
  >(GET_USERS_STREAMING_LIVE, queryOptions);

  useEffect(() => {
    getUsersStreamingLive();
  }, [getUsersStreamingLive]);

  const usersStreamingLive =
    getUsersStreamingLiveQuery.data?.getUsersStreamingLive;

  return [usersStreamingLive, getUsersStreamingLiveQuery];
};

export default useUsersStreamingLive;
