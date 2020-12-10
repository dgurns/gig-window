import { useMemo, useEffect } from 'react';
import { useLazyQuery, gql, LazyQueryResult } from '@apollo/client';
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

interface QueryData {
  getShowsForUser: Show[];
}
interface QueryVars {
  userId: number;
}

const useShowsForUser = (
  userId?: number
): [
  Show[] | undefined,
  LazyQueryResult<QueryData, QueryVars>,
  Show | undefined
] => {
  const [getShowsForUser, getShowsQuery] = useLazyQuery<QueryData, QueryVars>(
    GET_SHOWS_FOR_USER
  );
  useEffect(() => {
    if (userId) {
      getShowsForUser({ variables: { userId } });
    }
  }, [getShowsForUser, userId]);

  const shows = getShowsQuery.data?.getShowsForUser;
  const activeShow = useMemo(() => ShowService.getActiveShow(shows), [shows]);

  return [shows, getShowsQuery, activeShow];
};

export default useShowsForUser;
