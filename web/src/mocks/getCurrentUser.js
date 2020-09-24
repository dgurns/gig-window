import { GET_CURRENT_USER } from 'hooks/useCurrentUser';
import { seedUsers } from './seedUsers';

export const getCurrentUser_loggedOut = {
  request: {
    query: GET_CURRENT_USER,
  },
  result: {
    data: {
      getCurrentUser: null,
    },
  },
};

export const getCurrentUser_loggedIn = {
  request: {
    query: GET_CURRENT_USER,
  },
  result: {
    data: {
      getCurrentUser: seedUsers[1],
    },
  },
};

export const getCurrentUser_admin = {
  request: {
    query: GET_CURRENT_USER,
  },
  result: {
    data: {
      getCurrentUser: seedUsers[0],
    },
  },
};
