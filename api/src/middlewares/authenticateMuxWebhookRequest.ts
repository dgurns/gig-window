import { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import Mux from 'services/Mux';
import { SERVER_PORT } from '../';

const { WEB_ORIGIN, NODE_ENV } = process.env;

// const applyCorsToRequest = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const allowedOrigins = [WEB_ORIGIN];
//   if (NODE_ENV === 'development') {
//     allowedOrigins.push(`http://localhost:${SERVER_PORT}`);
//   }
//   const corsHandler = cors({
//     origin: function (origin, callback) {
//       console.log('origin', origin);
//       if (allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error('Request blocked by CORS'));
//       }
//     },
//     credentials: true,
//     optionsSuccessStatus: 200,
//   });

//   corsHandler(req, res, next);
// };

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
