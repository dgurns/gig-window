import { Router, Request, Response } from 'express';
import { User } from 'entities/User';
import Mux from 'services/Mux';
import { pubSub } from './';

const restRouter = Router();

const handleLiveStreamWebhook = async (req: Request, res: Response) => {
  const muxLiveStreamId = req.body.object.id;
  const user = await User.findOne({ muxLiveStreamId });
  if (!user) {
    return res.status(200).end();
  }

  const extractedStatusString = req.body.type.split('.').pop();
  user.muxLiveStreamStatus = extractedStatusString;
  await user.save();

  await pubSub.publish('MUX_LIVE_STREAM_STATUS_UPDATED', user);

  return res.status(200).end();
};

const handleAssetWebhook = async (req: Request, res: Response) => {
  const muxAssetId = req.body.object.id;
  const assetEventType = req.body.type;

  if (assetEventType === 'video.asset.live_stream_completed') {
    await Mux.deleteAsset(muxAssetId);
  }

  return res.status(200).end();
};

restRouter.post('/mux-webhook-event', async (req: Request, res: Response) => {
  const webhookTriggerType = req.body.object.type;

  try {
    switch (webhookTriggerType) {
      case 'live':
        return await handleLiveStreamWebhook(req, res);
      case 'asset':
        return await handleAssetWebhook(req, res);
      default:
        return res.status(200).end();
    }
  } catch {
    return res.status(500).end();
  }
});

export { restRouter };
