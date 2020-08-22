import { Router, Request, Response } from 'express';
import { User } from 'entities/User';
import { pubSub } from './';

const restRouter = Router();

restRouter.post('/mux-webhook-event', async (req: Request, res: Response) => {
  console.log('got a webhook - request:', req);

  const webhookTriggerType = req.body.object.type;
  if (webhookTriggerType !== 'live') {
    return res.status(200).end();
  }

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
});

export { restRouter };
