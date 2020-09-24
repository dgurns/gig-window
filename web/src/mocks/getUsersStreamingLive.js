import { GET_USERS_STREAMING_LIVE } from 'hooks/useUsersStreamingLive';
import { seedUsers } from './seedUsers';

export const getUsersStreamingLive_one = {
  request: {
    query: GET_USERS_STREAMING_LIVE,
  },
  result: {
    data: {
      getUsersStreamingLive: [seedUsers[0]],
    },
  },
};
