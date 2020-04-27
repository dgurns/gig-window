import { User } from 'entities/User';
import AwsMediaLive from 'services/aws/MediaLive';
import AwsMediaPackage from 'services/aws/MediaPackage';

const startInfrastructureForUser = async (user: User): Promise<void> => {
  try {
    user.liveVideoInfrastructureError = '';
    await user.save();

    await AwsMediaLive.maybeCreateRtmpPullInputForUser(user);
    await AwsMediaPackage.maybeCreateChannelForUser(user);
    await AwsMediaPackage.maybeCreateOriginEndpointForUser(user);
    await AwsMediaLive.maybeCreateChannelForUser(user);
    await AwsMediaLive.maybeStartChannelForUser(user);
  } catch (error) {
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

const checkUserIsStreamingLive = async (user: User) => {
  if (!user.isPublishingStream) return false;

  const infrastructureIsConfigured = checkInfrastructureIsConfiguredForUser(
    user
  );
  if (!infrastructureIsConfigured) return false;

  const describeChannelResponse = await AwsMediaLive.describeChannel(
    user.awsMediaLiveChannelId
  );
  if (describeChannelResponse.State === 'RUNNING') {
    // If user is publishing stream, infrastructure is ready, and channel
    // is 'RUNNING', we know user is streaming live
    return true;
  }

  return false;
};

export default {
  startInfrastructureForUser,
  checkInfrastructureIsConfiguredForUser,
  checkUserIsStreamingLive,
};
