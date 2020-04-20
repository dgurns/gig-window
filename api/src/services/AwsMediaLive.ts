import AwsMediaLive from 'aws-sdk/clients/medialive';

const MediaLive = new AwsMediaLive({
  apiVersion: '2017-10-14',
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const listChannels = async () => {
  const channels = await MediaLive.listChannels().promise();
  return channels;
};

export default {
  listChannels,
};
