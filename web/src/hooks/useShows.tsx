import { useQuery, gql, QueryHookOptions, QueryResult } from '@apollo/client';
import { Show } from 'types';

export const GET_SHOWS = gql`
  query GetShows($minShowtime: String, $take: Int, $skip: Int) {
    getShows(minShowtime: $minShowtime, take: $take, skip: $skip) {
      id
      title
      showtime
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

const useShows = ({
  minShowtime,
  take,
  skip,
  queryOptions,
}: UseShowsArgs = {}): [Show[] | undefined, QueryResult<Show>] => {
  const getShowsQuery = useQuery(GET_SHOWS, {
    variables: {
      minShowtime,
      take,
      skip,
    },
    ...queryOptions,
  });

  const shows = getShowsQuery.data?.getShows;

  return [shows, getShowsQuery];
};

export default useShows;
