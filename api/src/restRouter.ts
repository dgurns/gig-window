import { Router, Request, Response } from 'express';
import { User } from 'entities/User';

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
  } else if (eventType === 'publish_done') {
    user.isPublishingStream = false;
    await user.save();
  }

  return res.status(200).send();
});

export { restRouter };
