import { useQuery, gql, QueryResult } from '@apollo/client';

interface User {
  id: number;
  username: string;
  urlSlug: string;
  isPublishingStream: boolean;
  isInPublicMode: boolean;
  stripeAccountId?: string;
}

interface UserArgs {
  id?: number;
  urlSlug?: string;
}

const GET_USER = gql`
  query GetUser($id: Int, $urlSlug: String) {
    getUser(data: { id: $id, urlSlug: $urlSlug }) {
      id
      username
      urlSlug
      stripeAccountId
      isPublishingStream
      isInPublicMode
    }
  }
`;

const useUser = (userArgs: UserArgs): [User | undefined, QueryResult<User>] => {
  const getUserQuery = useQuery(GET_USER, {
    variables: { id: userArgs.id, urlSlug: userArgs.urlSlug },
    skip: !userArgs.id && !userArgs.urlSlug,
  });

  return [getUserQuery.data?.getUser, getUserQuery];
};

export default useUser;
