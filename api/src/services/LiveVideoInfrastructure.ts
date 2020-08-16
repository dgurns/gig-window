import addSeconds from 'date-fns/addSeconds';
import { User } from 'entities/User';
import AwsMediaLive from 'services/aws/MediaLive';
import AwsMediaPackage from 'services/aws/MediaPackage';
import Admin from 'services/Admin';

const startInfrastructureForUser = async (user: User): Promise<void> => {
  try {
    user.liveVideoInfrastructureError = '';
    await user.save();

    await AwsMediaLive.maybeCreateRtmpPullInputForUser(user);
    await AwsMediaPackage.maybeCreateChannelForUser(user);
    await AwsMediaPackage.maybeCreateOriginEndpointForUser(user);
    await AwsMediaLive.maybeCreateChannelForUser(user);
    await AwsMediaLive.maybeStartChannelForUser(user);
  } catch {
    user.liveVideoInfrastructureError =
      'Error starting live video infrastructure';
    await user.save();
  }
};

const checkInfrastructureIsConfiguredForUser = async (user: User) => {
  if (user.liveVideoInfrastructureError) {
    return false;
  }

  if (
    user.awsMediaLiveInputId &&
    user.awsMediaLiveChannelId &&
    user.awsMediaPackageChannelId &&
    user.awsMediaPackageChannelIngestUrl &&
    user.awsMediaPackageChannelIngestUsername &&
    user.awsMediaPackageChannelIngestPasswordParam &&
    user.awsMediaPackageOriginEndpointId &&
    user.awsMediaPackageOriginEndpointUrl
  ) {
    return true;
  }
  return false;
};

const checkUserLiveVideoIsActive = async (user: User) => {
  if (!user.isPublishingStream) return false;

  const infrastructureIsConfigured = checkInfrastructureIsConfiguredForUser(
    user
  );
  if (!infrastructureIsConfigured) return false;

  const describeChannelResponse = await AwsMediaLive.describeChannel(
    user.awsMediaLiveChannelId
  );
  if (describeChannelResponse.State !== 'RUNNING') {
    return false;
  }
  // Now that channel is confirmed to be 'RUNNING', save
  // the timestamp to user entity if it's not already there
  if (!user.awsMediaLiveChannelEnteredRunningStateTimestamp) {
    user.awsMediaLiveChannelEnteredRunningStateTimestamp = new Date();
    await user.save();
  }

  const INITIAL_STREAM_PROCESSING_TIME_IN_SECONDS = 10;
  const timestampToCompareForStreamReadiness =
    user.awsMediaLiveChannelEnteredRunningStateTimestamp >
    user.lastPublishedStreamStartTimestamp
      ? user.awsMediaLiveChannelEnteredRunningStateTimestamp
      : user.lastPublishedStreamStartTimestamp;
  const streamIsReadyThreshold = addSeconds(
    new Date(timestampToCompareForStreamReadiness),
    INITIAL_STREAM_PROCESSING_TIME_IN_SECONDS
  );
  if (new Date() > streamIsReadyThreshold) {
    return true;
  }

  return false;
};

const deleteStaleResources = async (): Promise<number> => {
  const usersWithStaleMediaLiveChannels = await Admin.getUsersWithStaleMediaLiveChannels();
  usersWithStaleMediaLiveChannels.forEach(async (user) => {
    await AwsMediaLive.stopChannel(user.awsMediaLiveChannelId);
    await AwsMediaLive.deleteChannel(user.awsMediaLiveChannelId);
    user.awsMediaLiveChannelId = '';
    user.awsMediaLiveChannelEnteredRunningStateTimestamp = undefined;
    await user.save();
  });

  return usersWithStaleMediaLiveChannels.length;
};

export default {
  startInfrastructureForUser,
  checkInfrastructureIsConfiguredForUser,
  checkUserLiveVideoIsActive,
  deleteStaleResources,
};
