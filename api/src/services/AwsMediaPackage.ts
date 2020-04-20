import AwsMediaPackage from 'aws-sdk/clients/mediapackage';
import { User } from 'entities/User';

const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

const MediaPackage = new AwsMediaPackage({
  apiVersion: '2017-10-12',
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const maybeCreateChannelForUser = async (user: User): Promise<void> => {
  if (user.awsMediaPackageChannelId) {
    try {
      // Check that channel is still valid. If so, return.
      await MediaPackage.describeChannel({
        Id: user.awsMediaPackageChannelId,
      }).promise();
      return;
    } catch {
      // If not, continue to create a new channel and save it to user.
    }
  }

  const channelParams = {
    Id: `${user.id}`,
    Description: user.username,
  };
  try {
    const channel = await MediaPackage.createChannel(channelParams).promise();
    if (channel.Id) {
      user.awsMediaPackageChannelId = channel.Id;
      await user.save();
    }
  } catch {}
};

export default {
  maybeCreateChannelForUser,
};
