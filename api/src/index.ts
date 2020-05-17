require('dotenv').config();
import 'reflect-metadata';

import http from 'http';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieSession from 'cookie-session';
import passport from 'passport';
import { ApolloServer } from 'apollo-server-express';
import { createConnection as createDatabaseConnection } from 'typeorm';
import { buildSchema } from 'type-graphql';
import depthLimit from 'graphql-depth-limit';
import { buildContext } from 'graphql-passport';

import { initializePassport } from './initializePassport';
import { restRouter } from './restRouter';
import { authChecker } from './authChecker';
import { User } from 'entities/User';
import { UserResolver } from 'resolvers/UserResolver';
import { ChatResolver } from 'resolvers/ChatResolver';
import { PaymentResolver } from 'resolvers/PaymentResolver';
import { AdminResolver } from 'resolvers/AdminResolver';
import { ShowResolver } from 'resolvers/ShowResolver';

const { RTMP_ORIGIN, UI_ORIGIN, SERVER_PORT, COOKIE_SESSION_KEY } = process.env;

async function start() {
  try {
    const connection = await createDatabaseConnection();
    // TODO: Only needed for using SQLite during development
    //       Remove this for production
    await connection.query('PRAGMA foreign_keys=OFF');
    await connection.synchronize();
    await connection.query('PRAGMA foreign_keys=ON');

    initializePassport();

    const app = express();
    const allowedOrigins = [
      RTMP_ORIGIN,
      UI_ORIGIN,
      `http://localhost:${SERVER_PORT}`,
    ];
    app.use(
      cors({
        origin: function (origin, callback) {
          if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
          } else {
            callback(new Error('Request blocked by CORS'));
          }
        },
        credentials: true,
        optionsSuccessStatus: 200,
      })
    );
    app.use(compression());
    app.use(
      cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [COOKIE_SESSION_KEY || 'defaultCookieSessionKey'],
      })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(restRouter);

    const schema = await buildSchema({
      resolvers: [
        UserResolver,
        ChatResolver,
        PaymentResolver,
        ShowResolver,
        AdminResolver,
      ],
      authChecker,
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
      cors: { origin: UI_ORIGIN, credentials: true },
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
