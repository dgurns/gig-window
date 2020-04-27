import AwsMediaPackage, {
  DescribeChannelResponse,
  CreateChannelResponse,
  IngestEndpoint,
  DescribeOriginEndpointResponse,
  CreateOriginEndpointResponse,
} from 'aws-sdk/clients/mediapackage';
import { AWSError } from 'aws-sdk';
import { User } from 'entities/User';
import AwsSystemsManager from 'services/aws/SystemsManager';
import { buildCreateOriginEndpointParams } from 'services/aws/MediaPackage.params';

const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

const MediaPackage = new AwsMediaPackage({
  apiVersion: '2017-10-12',
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const describeChannel = (
  channelId: string
): Promise<DescribeChannelResponse | AWSError> => {
  return MediaPackage.describeChannel({
    Id: channelId,
  }).promise();
};

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

const describeOriginEndpoint = (
  originEndpointId: string
): Promise<DescribeOriginEndpointResponse | AWSError> => {
  return MediaPackage.describeOriginEndpoint({
    Id: originEndpointId,
  }).promise();
};

const maybeCreateOriginEndpointForUser = async (
  user: User
): Promise<
  DescribeOriginEndpointResponse | CreateOriginEndpointResponse | AWSError
> => {
  if (user.awsMediaPackageOriginEndpointId) {
    // Check that origin endpoint is still valid. If so, return.
    try {
      const existingOriginEndpoint = await describeOriginEndpoint(
        user.awsMediaPackageOriginEndpointId
      );
      return existingOriginEndpoint;
    } catch {}
  }

  // If not, continue to create a new origin endpoint and save it to user.
  const params = buildCreateOriginEndpointParams(user);
  const newOriginEndpoint = await MediaPackage.createOriginEndpoint(
    params
  ).promise();
  if (newOriginEndpoint.Id) {
    user.awsMediaPackageOriginEndpointId = newOriginEndpoint.Id;
    await user.save();
    return newOriginEndpoint;
  } else {
    throw new Error('Error creating MediaPackage origin endpoint');
  }
};

export default {
  describeChannel,
  maybeCreateChannelForUser,
  describeOriginEndpoint,
  maybeCreateOriginEndpointForUser,
};
