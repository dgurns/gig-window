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
  hasAccessToLiveStream,
};
