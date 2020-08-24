import Mux from '@mux/mux-node';
import { User } from 'entities/User';

const { MUX_USE_TEST_LIVE_STREAMS } = process.env;

const { Video: MuxVideo } = new Mux();

const createLiveStreamForUser = async (user: User) => {
  const liveStream = await MuxVideo.LiveStreams.create({
    playback_policy: 'public',
    reduced_latency: true,
    test: MUX_USE_TEST_LIVE_STREAMS === 'true' ? true : false,
  });

  user.muxLiveStreamId = liveStream.id;
  user.muxStreamKey = liveStream.stream_key;
  user.muxPlaybackId = liveStream.playback_ids?.pop()?.id;
  await user.save();

  return liveStream.id;
};

const deleteAsset = (assetId: string) => {
  return MuxVideo.Assets.del(assetId);
};

export default {
  createLiveStreamForUser,
  deleteAsset,
};
