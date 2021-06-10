import { useEffect } from 'react';
import {
  useLazyQuery,
  gql,
  QueryHookOptions,
  LazyQueryResult,
} from '@apollo/client';
import { Show } from 'types';

export const GET_SHOWS = gql`
  query GetShows($minShowtime: String, $take: Int, $skip: Int) {
    getShows(minShowtime: $minShowtime, take: $take, skip: $skip) {
      id
      title
      showtime
      minPriceInCents
      user {
        id
        username
        urlSlug
        profileImageUrl
      }
    }
  }
`;

interface UseShowsArgs {
  minShowtime?: string;
  take?: number;
  skip?: number;
  queryOptions?: QueryHookOptions;
}

interface QueryData {
  getShows: Show[];
}
interface QueryVars {
  minShowtime?: string;
  take?: number;
  skip?: number;
}

const useShows = ({
  minShowtime,
  take,
  skip,
  queryOptions,
}: UseShowsArgs = {}): [
  Show[] | undefined,
  LazyQueryResult<QueryData, QueryVars>
] => {
  const [getShows, getShowsQuery] = useLazyQuery<QueryData>(
    GET_SHOWS,
    queryOptions
  );

  useEffect(() => {
    getShows({ variables: { minShowtime, take, skip } });
  }, [getShows, minShowtime, take, skip]);

  const shows = getShowsQuery.data?.getShows;

  return [shows, getShowsQuery];
};

export default useShows;
