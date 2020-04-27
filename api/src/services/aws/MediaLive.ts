import AwsMediaLive, {
  DescribeInputResponse,
  CreateInputResponse,
  DescribeChannelResponse,
  CreateChannelResponse,
  StartChannelResponse,
} from 'aws-sdk/clients/medialive';
import { AWSError } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { User } from 'entities/User';
import { buildCreateChannelParams } from 'services/aws/MediaLive.params';

const {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  RTMP_ORIGIN,
  RTMP_PATH,
} = process.env;

const MediaLive = new AwsMediaLive({
  apiVersion: '2017-10-14',
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const maybeCreateRtmpPullInputForUser = async (
  user: User
): Promise<DescribeInputResponse | CreateInputResponse['Input'] | AWSError> => {
  if (user.awsMediaLiveInputId) {
    // Check that input is still valid. If so, return.
    try {
      const input = await MediaLive.describeInput({
        InputId: user.awsMediaLiveInputId,
      }).promise();
      if (input.Id) {
        return input;
      }
    } catch {}
  }

  // If not, continue to create a new input and save it to user.
  const inputParams = {
    Name: `${user.id}`,
    Type: 'RTMP_PULL',
    Sources: [{ Url: `${RTMP_ORIGIN}${RTMP_PATH}/${user.streamKey}` }],
  };
  const input = await MediaLive.createInput(inputParams).promise();
  if (input.Input && input.Input.Id) {
    user.awsMediaLiveInputId = input.Input.Id;
    await user.save();
    return input.Input;
  } else {
    throw new Error('Error creating RTMP pull input');
  }
};

const describeChannel = (
  channelId: string
): Promise<PromiseResult<DescribeChannelResponse, AWSError>> => {
  return MediaLive.describeChannel({
    ChannelId: channelId,
  }).promise();
};

const maybeCreateChannelForUser = async (
  user: User
): Promise<DescribeChannelResponse | CreateChannelResponse | AWSError> => {
  if (user.awsMediaLiveChannelId) {
    // Check that channel is still valid. If so, return.
    try {
      const existingChannel = await describeChannel(user.awsMediaLiveChannelId);
      return existingChannel;
    } catch {}
  }

  // If not, create a new channel
  const params = buildCreateChannelParams(user);
  const channel = await MediaLive.createChannel(params).promise();
  if (channel.Channel && channel.Channel.Id) {
    user.awsMediaLiveChannelId = channel.Channel.Id;
    await user.save();
    return channel;
  } else {
    throw new Error('Error creating MediaLive channel');
  }
};

const maybeStartChannelForUser = async (
  user: User
): Promise<DescribeChannelResponse | StartChannelResponse | AWSError> => {
  if (user.awsMediaLiveChannelId) {
    try {
      // Get current channel state
      const describeChannelResponse = await MediaLive.describeChannel({
        ChannelId: user.awsMediaLiveChannelId,
      }).promise();
      const channelState = describeChannelResponse.State;

      if (channelState === 'RUNNING') {
        return describeChannelResponse;
      } else if (channelState === 'CREATING') {
        await MediaLive.waitFor('channelCreated', {
          ChannelId: user.awsMediaLiveChannelId,
        }).promise();
      }
    } catch {}

    return await MediaLive.startChannel({
      ChannelId: user.awsMediaLiveChannelId,
    }).promise();
  } else {
    throw new Error('User has no channel under that ID');
  }
};

export default {
  maybeCreateRtmpPullInputForUser,
  describeChannel,
  maybeCreateChannelForUser,
  maybeStartChannelForUser,
};
