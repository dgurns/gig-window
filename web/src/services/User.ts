const isStreamingLive = (
  isPublishingStream?: boolean,
  isInPublicMode?: boolean
) => {
  if (isPublishingStream && isInPublicMode) {
    return true;
  }
  return false;
};

const hasAccessToLiveStream = (
  hasPaymentForShow?: boolean,
  hasRecentPaymentToPayee?: boolean
) => {
  if (hasPaymentForShow || hasRecentPaymentToPayee) {
    return true;
  }
  return false;
};

export default {
  isStreamingLive,
  hasAccessToLiveStream,
};
