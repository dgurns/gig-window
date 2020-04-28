import { useQuery, gql, ApolloError } from '@apollo/client';
import { User } from '../../../api/src/entities/User';

interface UserArgs {
  id?: number;
  urlSlug?: string;
}

const GET_USER = gql`
  query GetUser({ $id: Number, $urlSlug: String) {
    getUser(data: { id: $id, urlSlug: $urlSlug }) {
      id
      username
      urlSlug
    }
  }
`;

const useUser = (
  userArgs: UserArgs
): [User | undefined, boolean, ApolloError | undefined] => {
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id: userArgs.id, urlSlug: userArgs.urlSlug },
  });

  let user;
  if (data?.getUser) {
    user = data.getUser;
  }

  return [user, loading, error];
};

export default useUser;
