import { useEffect } from 'react';
import { useQuery, gql, QueryHookOptions, QueryResult } from '@apollo/client';
import { User } from 'types';

const CHECK_USER_LIVE_VIDEO_IS_ACTIVE = gql`
  query CheckUserLiveVideoIsActive($userId: Int, $userUrlSlug: String) {
    checkUserLiveVideoIsActive(userId: $userId, userUrlSlug: $userUrlSlug)
  }
`;

interface UseLiveVideoArgs {
  user?: User;
  queryOptions?: QueryHookOptions;
}

const useLiveVideo = ({
  user,
  queryOptions,
}: UseLiveVideoArgs): [boolean, QueryResult<boolean>] => {
  const { id, urlSlug, isPublishingStream } = user ?? {};

  const liveVideoIsActiveQuery = useQuery(CHECK_USER_LIVE_VIDEO_IS_ACTIVE, {
    variables: {
      userId: id,
      userUrlSlug: urlSlug,
    },
    skip: !user,
    ...queryOptions,
  });
  const { data, startPolling, stopPolling, refetch } = liveVideoIsActiveQuery;

  const liveVideoIsActive = data?.checkUserLiveVideoIsActive ?? false;

  useEffect(() => {
    if (isPublishingStream && !liveVideoIsActive) {
      startPolling(3000);
    } else if (isPublishingStream && liveVideoIsActive) {
      stopPolling();
    } else if (!isPublishingStream && liveVideoIsActive) {
      refetch();
    }
  }, [
    isPublishingStream,
    liveVideoIsActive,
    startPolling,
    stopPolling,
    refetch,
  ]);

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  return [liveVideoIsActive, liveVideoIsActiveQuery];
};

export default useLiveVideo;
