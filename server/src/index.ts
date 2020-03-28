require('dotenv').config();
import 'reflect-metadata';

import express from 'express';
import compression from 'compression';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { ApolloServer } from 'apollo-server-express';
import { createConnection } from 'typeorm';
import { buildSchema } from 'type-graphql';
import depthLimit from 'graphql-depth-limit';
import { GraphQLLocalStrategy, buildContext } from 'graphql-passport';

import { authChecker } from './auth-checker';
import { User } from 'entities/User';
import { UserResolver } from 'resolvers/UserResolver';

async function start() {
  try {
    await createConnection();

    passport.use(
      new GraphQLLocalStrategy(
        async (
          email: unknown,
          password: unknown,
          done: (error: any, user: User | undefined) => void
        ) => {
          const user = await User.findOne({ where: { email, password } });
          const error = user ? null : new Error('No matching user');
          done(error, user);
        }
      )
    );

    const app = express();
    app.use(
      '*',
      cors({
        origin: process.env.UI_ORIGIN
      })
    );
    app.use(compression());
    app.use(
      session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.EXPRESS_SESSION_SECRET || 'expressSessionSecret'
      })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    const schema = await buildSchema({
      resolvers: [UserResolver],
      authChecker
    });
    const server = new ApolloServer({
      schema,
      validationRules: [depthLimit(7)],
      context: ({ req, res }) => buildContext({ req, res, User })
    });

    server.applyMiddleware({ app });

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
