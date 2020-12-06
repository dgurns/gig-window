import Mux from '@mux/mux-node';
import { Request } from 'express';
import { User } from 'entities/User';

const { MUX_USE_TEST_LIVE_STREAMS, MUX_WEBHOOK_SECRET } = process.env;

const { Video: MuxVideo } = new Mux();

const verifyWebhookSignature = (incomingRequest: Request): boolean => {
  try {
    const signature = incomingRequest.headers['mux-signature'];
    const body = incomingRequest.body;
    if (
      !signature ||
      Array.isArray(signature) ||
      !body ||
      !MUX_WEBHOOK_SECRET
    ) {
      return false;
    }
    return Mux.Webhooks.verifyHeader(body, signature, MUX_WEBHOOK_SECRET);
  } catch {
    return false;
  }
};

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
  verifyWebhookSignature,
  createLiveStreamForUser,
  deleteAsset,
};
