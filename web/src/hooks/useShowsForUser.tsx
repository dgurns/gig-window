import { useMemo } from 'react';
import { useQuery, gql, QueryResult } from '@apollo/client';
import ShowService from 'services/Show';
import { Show } from 'types';

const GET_SHOWS_FOR_USER = gql`
  query GetShowsForUser($userId: Int!) {
    getShowsForUser(userId: $userId) {
      id
      title
      showtime
      minPriceInCents
    }
  }
`;

const useShowsForUser = (
  userId?: number
): [Show[] | undefined, QueryResult<Show>, Show | undefined] => {
  const getShowsQuery = useQuery(GET_SHOWS_FOR_USER, {
    variables: { userId },
    skip: !userId,
  });

  const shows = getShowsQuery.data?.getShowsForUser;
  const activeShow = useMemo(() => ShowService.getActiveShow(shows), [shows]);

  return [shows, getShowsQuery, activeShow];
};

export default useShowsForUser;
