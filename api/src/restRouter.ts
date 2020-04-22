import { Router, Request, Response } from 'express';
import { User } from 'entities/User';
import AwsMediaLive from 'services/AwsMediaLive';
import AwsMediaPackage from 'services/AwsMediaPackage';

const restRouter = Router();

restRouter.get('/rtmp-event', async (req: Request, res: Response) => {
  const eventStreamKey = req.query.name;
  const user = await User.findOne({ streamKey: eventStreamKey });
  if (!user) {
    return res.status(401).send();
  }

  const eventType = req.query.call;
  if (eventType === 'publish') {
    user.isPublishingStream = true;
    await user.save();

    await AwsMediaLive.maybeCreateRtmpPullInputForUser(user);
    await AwsMediaPackage.maybeCreateChannelForUser(user);
    await AwsMediaLive.maybeCreateChannelForUser(user);
  } else if (eventType === 'publish_done') {
    user.isPublishingStream = false;
    await user.save();
  }

  return res.status(200).send();
});

export { restRouter };
