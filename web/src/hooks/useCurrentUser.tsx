import { useQuery, gql, ApolloError } from '@apollo/client';

type User = {
  id: string;
  email: string;
  username: string;
};

const GET_CURRENT_USER = gql`
  {
    getCurrentUser {
      id
      email
      username
    }
  }
`;

const useCurrentUser = (): [
  User | undefined,
  boolean,
  ApolloError | undefined
] => {
  const { data, loading, error } = useQuery(GET_CURRENT_USER);

  let currentUser;
  if (data?.getCurrentUser) {
    currentUser = data.getCurrentUser;
  }

  return [currentUser, loading, error];
};

export default useCurrentUser;
