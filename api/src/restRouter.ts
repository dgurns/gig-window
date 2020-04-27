import { Router, Request, Response } from 'express';
import { User } from 'entities/User';
import LiveVideoInfrastucture from 'services/LiveVideoInfrastructure';

const restRouter = Router();

restRouter.get('/rtmp-event', async (req: Request, res: Response) => {
  const eventStreamKey = req.query.name;
  const user = await User.findOne({ streamKey: eventStreamKey });
  if (!user) {
    return res.status(401).send();
  }

  try {
    const eventType = req.query.call;
    if (eventType === 'publish') {
      user.isPublishingStream = true;
      await user.save();

      LiveVideoInfrastucture.startLiveVideoInfrastructureForUser(user);
    } else if (eventType === 'publish_done' || eventType === 'disconnect') {
      user.isPublishingStream = false;
      await user.save();
    }

    return res.status(200).send();
  } catch (error) {
    // We're about to reject this publish request, so
    // we set isPublishingStream to false
    user.isPublishingStream = false;
    await user.save();

    return res.status(500).send();
  }
});

export { restRouter };
