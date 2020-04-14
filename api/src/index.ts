require('dotenv').config();
import 'reflect-metadata';

import express from 'express';
import compression from 'compression';
import cookieSession from 'cookie-session';
import passport from 'passport';
import { ApolloServer } from 'apollo-server-express';
import { createConnection as createDatabaseConnection } from 'typeorm';
import { buildSchema } from 'type-graphql';
import depthLimit from 'graphql-depth-limit';
import { buildContext } from 'graphql-passport';

import { initializePassport } from './initializePassport';
import { authChecker } from './authChecker';
import { User } from 'entities/User';
import { UserResolver } from 'resolvers/UserResolver';

async function start() {
  try {
    await createDatabaseConnection();
    initializePassport();

    const app = express();
    app.use(compression());
    app.use(
      cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [process.env.COOKIE_SESSION_KEY || 'defaultCookieSessionKey'],
      })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    const schema = await buildSchema({
      resolvers: [UserResolver],
      authChecker,
      validate: false,
    });
    const server = new ApolloServer({
      schema,
      validationRules: [depthLimit(7)],
      context: ({ req, res }) => buildContext({ req, res, User }),
    });

    server.applyMiddleware({
      app,
      cors: { origin: process.env.UI_ORIGIN, credentials: true },
    });

    app.listen({ port: 4000 }, () =>
      console.log(
        `🚀 Server ready at http://localhost:${process.env.SERVER_PORT}${server.graphqlPath}`
      )
    );
  } catch (error) {
    console.log(error);
  }
}

start();
