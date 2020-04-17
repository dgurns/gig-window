import { Router, Request, Response } from 'express';

const restRouter = Router();

restRouter.get('/rtmp-event', (req: Request, res: Response) => {
  console.log(req.query);
  res.status(200).send();
});

export { restRouter };
