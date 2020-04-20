import AwsMediaLive from 'aws-sdk/clients/medialive';
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

const maybeCreateRtmpPullInputForUser = async (user: User): Promise<void> => {
  if (user.awsMediaLiveInputId) {
    try {
      // Check that input is still valid. If so, return.
      await MediaLive.describeInput({
        InputId: user.awsMediaLiveInputId,
      }).promise();
      return;
    } catch {
      // If not, continue to create a new input and save it to user.
    }
  }

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
    }
  } catch {}
};

export default {
  maybeCreateRtmpPullInputForUser,
};
