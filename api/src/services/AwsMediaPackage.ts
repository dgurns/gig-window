import AwsMediaPackage, {
  DescribeChannelResponse,
  CreateChannelResponse,
} from 'aws-sdk/clients/mediapackage';
import { AWSError } from 'aws-sdk';
import { User } from 'entities/User';

const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

const MediaPackage = new AwsMediaPackage({
  apiVersion: '2017-10-12',
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const maybeCreateChannelForUser = async (
  user: User
): Promise<
  DescribeChannelResponse | CreateChannelResponse | AWSError | undefined
> => {
  if (user.awsMediaPackageChannelId) {
    // Check that channel is still valid. If so, return.
    try {
      const existingChannel = await MediaPackage.describeChannel({
        Id: user.awsMediaPackageChannelId,
      }).promise();
      return existingChannel;
    } catch {}
  }

  // If not, continue to create a new channel and save it to user.
  const channelParams = {
    Id: `${user.id}`,
    Description: user.username,
  };
  try {
    const newChannel = await MediaPackage.createChannel(
      channelParams
    ).promise();
    if (newChannel.Id) {
      user.awsMediaPackageChannelId = newChannel.Id;
      await user.save();
      return newChannel;
    }
  } catch (error) {
    return error;
  }
};

export default {
  maybeCreateChannelForUser,
};
