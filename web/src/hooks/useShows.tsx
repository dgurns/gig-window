import { useQuery, gql, QueryResult } from '@apollo/client';
import { Show } from '../../../api/src/entities/Show';

const GET_SHOWS = gql`
  query GetShowsForUser($userId: Int!) {
    getShowsForUser(userId: $userId) {
      id
      title
      showtime
    }
  }
`;

const useShows = (userId?: number): [Show[] | undefined, QueryResult<Show>] => {
  const getShowsQuery = useQuery(GET_SHOWS, {
    variables: { userId },
    skip: !userId,
  });

  return [getShowsQuery.data?.getShowsForUser, getShowsQuery];
};

export default useShows;
