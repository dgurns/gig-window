import { User } from 'entities/User';
import AwsMediaLive from 'services/aws/MediaLive';
import AwsMediaPackage from 'services/aws/MediaPackage';

const startLiveVideoInfrastructureForUser = async (
  user: User
): Promise<void> => {
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

export default {
  startLiveVideoInfrastructureForUser,
};
