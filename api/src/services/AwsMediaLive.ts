import AwsMediaLive, {
  DescribeInputResponse,
  CreateInputResponse,
  DescribeChannelResponse,
  CreateChannelResponse,
} from 'aws-sdk/clients/medialive';
import { AWSError } from 'aws-sdk';
import { User } from 'entities/User';

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
  try {
    const input = await MediaLive.createInput(inputParams).promise();
    if (input.Input && input.Input.Id) {
      user.awsMediaLiveInputId = input.Input.Id;
      await user.save();
      return input.Input;
    } else {
      throw new Error('Error creating input');
    }
  } catch (error) {
    return error;
  }
};

const maybeCreateChannelForUser = async (
  user: User
): Promise<
  DescribeChannelResponse | CreateChannelResponse['Channel'] | AWSError
> => {
  if (user.awsMediaLiveChannelId) {
    try {
      const existingChannel = await MediaLive.describeChannel({
        ChannelId: user.awsMediaLiveChannelId,
      }).promise();
      if (existingChannel) {
        return existingChannel;
      }
    } catch {}
  }

  try {
    const channel = await MediaLive.createChannel({
      Name: user.id,
      InputAttachments: [
        {
          InputAttachmentName: user.id,
          InputId: user.awsMediaLiveInputId,
        },
      ],
      InputSpecification: {
        Codec: 'AVC',
        MaximumBitrate: 'MAX_10_MBPS',
        Resolution: 'HD',
      },
      ChannelClass: 'SINGLE_PIPELINE',
      Destinations: [
        {
          Id: 'media-package-channel',
          Settings: [
            {
              Url: user.awsMediaPackageChannelInputUrl,
              Username: user.awsMediaPackageChannelInputUsername,
              PasswordParam: path to EC2 Systems Manager Parameter Store
            }
          ]
        },
      ],
      EncoderSettings: {
        OutputGroups: [
          {
            Name: 'DefaultOutputGroup',
            OutputGroupSettings: {
              HlsGroupSettings: {
                Destination: {
                  DestinationRefId: 'media-package-channel'
                },
                HlsCdnSettings: {
                  HlsBasicPutSettings: {
                    ConnectionRetryInterval: 1,
                    NumRetries: 10,
                    FilecacheDuration: 300,
                    RestartDelay: 5
                  }
                },
                SegmentLength: 2
              }
            },
            Outputs: [
              {
                OutputName: '720p192',
                VideoDescriptionName: 'video_1280_720',
                AudioDescriptionNames: ['audio_aac192'],
              },
              {
                OutputName: '432p192',
                VideoDescriptionName: 'video_768_432',
                AudioDescriptionNames: ['audio_aac192'],
              },
              {
                OutputName: '360p120',
                VideoDescriptionName: 'video_640_360',
                AudioDescriptionNames: ['audio_aac120'],
              },
              {
                OutputName: '270p120',
                VideoDescriptionName: 'video_480_270',
                AudioDescriptionNames: ['audio_aac120'],
              },
              {
                OutputName: '234p96',
                VideoDescriptionName: 'video_416_234',
                AudioDescriptionNames: ['audio_aac96'],
              },
            ],
          },
        ],
        AudioDescriptions: [
          {
            Name: 'audio_aac192',
            CodecSettings: {
              AacSettings: {
                Bitrate: 192000,
                CodingMode: 'CODING_MODE_2_0',
                Profile: 'LC',
                SampleRate: 48000,
              },
            },
          },
          {
            Name: 'audio_aac120',
            CodecSettings: {
              AacSettings: {
                Bitrate: 120000,
                CodingMode: 'CODING_MODE_2_0',
                Profile: 'LC',
                SampleRate: 48000,
              },
            },
          },
          {
            Name: 'audio_aac96',
            CodecSettings: {
              AacSettings: {
                Bitrate: 96000,
                CodingMode: 'CODING_MODE_2_0',
                Profile: 'LC',
                SampleRate: 48000,
              },
            },
          },
        ],
        VideoDescriptions: [
          {
            Name: 'video_1280_720',
            Height: 720,
            Width: 1280,
            CodecSettings: {
              H264Settings: {
                Bitrate: 2500000,
                RateControlMode: 'CBR',
              },
            },
          },
          {
            Name: 'video_768_432',
            Height: 432,
            Width: 768,
            CodecSettings: {
              H264Settings: {
                Bitrate: 1200000,
                RateControlMode: 'CBR',
              },
            },
          },
          {
            Name: 'video_640_360',
            Height: 360,
            Width: 640,
            CodecSettings: {
              H264Settings: {
                Bitrate: 800000,
                RateControlMode: 'CBR',
              },
            },
          },
          {
            Name: 'video_480_270',
            Height: 270,
            Width: 480,
            CodecSettings: {
              H264Settings: {
                Bitrate: 400000,
                RateControlMode: 'CBR',
              },
            },
          },
          {
            Name: 'video_416_234',
            Height: 236,
            Width: 416,
            CodecSettings: {
              H264Settings: {
                Bitrate: 200000,
                RateControlMode: 'CBR',
              },
            },
          },
        ],
        TimecodeConfig: {
          Source: 'SYSTEMCLOCK',
        },
      },
    }).promise();

    if (channel.Channel && channel.Channel.Id) {
      user.awsMediaLiveChannelId = channel.Channel.Id;
      await user.save();
      return channel.Channel;
    }
  } catch (error) {
    return error;
  }
};

const describeChannel = async (
  channelId: string
): Promise<DescribeChannelResponse | AWSError> => {
  try {
    const channel = await MediaLive.describeChannel({
      ChannelId: channelId,
    }).promise();
    return channel;
  } catch (error) {
    return error;
  }
};

export default {
  maybeCreateRtmpPullInputForUser,
  maybeCreateChannelForUser,
  describeChannel,
};
