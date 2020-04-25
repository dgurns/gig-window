import AwsMediaPackage, {
  DescribeChannelResponse,
  CreateChannelResponse,
  IngestEndpoint,
} from 'aws-sdk/clients/mediapackage';
import { AWSError } from 'aws-sdk';
import { User } from 'entities/User';
import AwsSystemsManager from './AwsSystemsManager';

const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

const MediaPackage = new AwsMediaPackage({
  apiVersion: '2017-10-12',
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const saveIngestEndpointToUser = async (
  ingestEndpoint: IngestEndpoint,
  user: User
) => {
  const { Id, Url, Username, Password } = ingestEndpoint;

  if (Id && Url && Username && Password) {
    user.awsMediaPackageChannelIngestUrl = Url;
    user.awsMediaPackageChannelIngestUsername = Username;

    const passwordParam = `/medialive/password-for-media-package-ingest-id-${Id}`;
    await AwsSystemsManager.putParameter(passwordParam, Password);
    user.awsMediaPackageChannelIngestPasswordParam = passwordParam;
  } else {
    throw new Error('Error saving MediaPackage ingest endpoint to user');
  }

  await user.save();
};

const maybeCreateChannelForUser = async (
  user: User
): Promise<
  DescribeChannelResponse | CreateChannelResponse | AWSError | undefined
> => {
  if (user.awsMediaPackageChannelId) {
    // Check that channel is still valid. If so, return.
    try {
      const existingChannel = await describeChannel(
        user.awsMediaPackageChannelId
      );
      return existingChannel;
    } catch {}
  }

  // If not, continue to create a new channel and save it to user.
  const channelParams = {
    Id: `${user.id}`,
    Description: user.username,
  };
  const newChannel = await MediaPackage.createChannel(channelParams).promise();
  if (newChannel.Id) {
    user.awsMediaPackageChannelId = newChannel.Id;

    const ingestEndpoints = newChannel.HlsIngest?.IngestEndpoints || [];
    await saveIngestEndpointToUser(ingestEndpoints[0], user);

    await user.save();
    return newChannel;
  } else {
    throw new Error('Error creating MediaPackage channel');
  }
};

const describeChannel = async (
  channelId: string
): Promise<DescribeChannelResponse | AWSError> => {
  const describeChannelResponse = await MediaPackage.describeChannel({
    Id: channelId,
  }).promise();
  return describeChannelResponse;
};

export default {
  maybeCreateChannelForUser,
  describeChannel,
};
