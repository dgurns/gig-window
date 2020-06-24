import { useQuery, gql, QueryHookOptions, QueryResult } from '@apollo/client';

const CHECK_USER_LIVE_VIDEO_IS_ACTIVE = gql`
  query CheckUserLiveVideoIsActive($userId: Int, $userUrlSlug: String) {
    checkUserLiveVideoIsActive(userId: $userId, userUrlSlug: $userUrlSlug)
  }
`;

interface UseLiveVideoArgs {
  userId?: number;
  userUrlSlug?: string;
  queryOptions?: QueryHookOptions;
}

const useLiveVideo = ({
  userId,
  userUrlSlug,
  queryOptions,
}: UseLiveVideoArgs): [boolean, QueryResult<boolean>] => {
  const liveVideoIsActiveQuery = useQuery(CHECK_USER_LIVE_VIDEO_IS_ACTIVE, {
    variables: {
      userId,
      userUrlSlug,
    },
    ...queryOptions,
  });

  const liveVideoIsActive =
    liveVideoIsActiveQuery.data?.checkUserLiveVideoIsActive ?? false;

  return [liveVideoIsActive, liveVideoIsActiveQuery];
};

export default useLiveVideo;
