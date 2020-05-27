import { useMemo } from 'react';
import { useQuery, gql, QueryResult } from '@apollo/client';
import Show from 'services/Show';

interface Show {
  id: number;
  title: string;
  showtime: string;
}

const GET_SHOWS = gql`
  query GetShowsForUser($userId: Int!) {
    getShowsForUser(userId: $userId) {
      id
      title
      showtime
    }
  }
`;

const useShows = (
  userId?: number
): [Show[] | undefined, QueryResult<Show>, Show | undefined] => {
  const getShowsQuery = useQuery(GET_SHOWS, {
    variables: { userId },
    skip: !userId,
  });

  const shows = getShowsQuery.data?.getShowsForUser;
  const activeShow = useMemo(() => Show.getActiveShow(shows), [shows]);

  return [shows, getShowsQuery, activeShow];
};

export default useShows;
