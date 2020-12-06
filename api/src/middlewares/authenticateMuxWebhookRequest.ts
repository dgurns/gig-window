import { Request, Response, NextFunction } from 'express';

import Mux from 'services/Mux';

export const authenticateMuxWebhookRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers['mux-signature']) {
    return res.status(400).send('Request is missing Mux webhook signature');
  }

  const isVerified = Mux.verifyWebhookSignature(req);
  if (isVerified) {
    return next();
  } else {
    return res.status(401).send('Request has an invalid Mux webhook signature');
  }
};
