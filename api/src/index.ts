require('dotenv').config();
import 'reflect-metadata';

import http from 'http';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieSession from 'cookie-session';
import passport from 'passport';
import { ApolloServer } from 'apollo-server-express';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import { buildSchema } from 'type-graphql';
import depthLimit from 'graphql-depth-limit';
import { buildContext } from 'graphql-passport';

import { connectToDatabase } from './connectToDatabase';
import { initializePassport } from './initializePassport';
import { restRouter } from './restRouter';
import { authChecker } from './authChecker';
import { User } from 'entities/User';
import { UserResolver } from 'resolvers/UserResolver';
import { ChatResolver } from 'resolvers/ChatResolver';
import { ChatEventResolver } from 'resolvers/ChatEventResolver';
import { PaymentResolver } from 'resolvers/PaymentResolver';
import { ShowResolver } from 'resolvers/ShowResolver';
import { AdminResolver } from 'resolvers/AdminResolver';

const {
  NODE_ENV,
  REDIS_HOST,
  REDIS_PORT,
  WEB_ORIGIN,
  COOKIE_SESSION_KEY,
} = process.env;
const SERVER_PORT = 4000;

const redisOptions = {
  host: REDIS_HOST,
  port: REDIS_PORT ? parseInt(REDIS_PORT) : undefined,
  retryStrategy: () => 2000,
};
export const pubSub = new RedisPubSub({
  publisher: new Redis(redisOptions),
  subscriber: new Redis(redisOptions),
});

async function start() {
  try {
    await connectToDatabase();
    initializePassport();

    const app = express();

    app.use(compression());
    app.use(
      cookieSession({
        name: 'session',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [COOKIE_SESSION_KEY || 'defaultCookieSessionKey'],
      })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    // Non-GraphQL requests, including webhooks, are handled by the REST router
    app.use(restRouter);

    // Apply CORS to all further requests when not in development mode
    if (NODE_ENV !== 'development') {
      const allowedOrigins = [WEB_ORIGIN];
      app.use(
        cors({
          origin: function (origin, callback) {
            if (origin && allowedOrigins.indexOf(origin) !== -1) {
              callback(null, true);
            } else {
              callback(new Error('Request blocked by CORS'));
            }
          },
          credentials: true,
          optionsSuccessStatus: 200,
        })
      );
    }

    const schema = await buildSchema({
      resolvers: [
        UserResolver,
        ChatResolver,
        ChatEventResolver,
        PaymentResolver,
        ShowResolver,
        AdminResolver,
      ],
      pubSub,
      authChecker,
      authMode: 'null',
      dateScalarMode: 'isoDate',
      validate: false,
    });
    const server = new ApolloServer({
      schema,
      validationRules: [depthLimit(7)],
      context: ({ req, res }) => buildContext({ req, res, User }),
    });

    server.applyMiddleware({
      app,
      cors: {
        origin: WEB_ORIGIN,
        credentials: true,
      },
    });
    const httpServer = http.createServer(app);
    server.installSubscriptionHandlers(httpServer);

    httpServer.listen({ port: SERVER_PORT }, () => {
      console.log(`🚀 api ready on port ${SERVER_PORT}`);
      console.log(`GraphQL http connections at ${server.graphqlPath}`);
      console.log(
        `GraphQL websocket connections at ${server.subscriptionsPath}`
      );
    });
  } catch (error) {
    console.log(error);
  }
}

start();
