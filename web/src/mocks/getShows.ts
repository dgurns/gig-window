import { GET_SHOWS } from 'hooks/useShows';
import { seedShows } from './seedShows';

export const getShows_two = {
  request: {
    query: GET_SHOWS,
    variables: {
      minShowtime: '2020-09-24T11:00:00.000Z',
      take: 40,
      skip: 0,
    },
  },
  result: {
    data: {
      getShows: [seedShows[0], seedShows[1]],
    },
  },
};
