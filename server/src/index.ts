require('dotenv').config();
import 'reflect-metadata';

import express from 'express';
import compression from 'compression';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { createConnection } from 'typeorm';
import { buildSchema } from 'type-graphql';
import depthLimit from 'graphql-depth-limit';

import { authChecker } from './auth-checker';
import { UserResolver } from 'resolvers/UserResolver';

const { SERVER_PORT, UI_ORIGIN } = process.env;

async function start() {
  try {
    await createConnection();
    const schema = await buildSchema({
      resolvers: [UserResolver],
      authChecker
    });

    const server = new ApolloServer({
      schema,
      validationRules: [depthLimit(7)]
    });

    const app = express();
    app.use(
      '*',
      cors({
        origin: UI_ORIGIN
      })
    );
    app.use(compression());

    server.applyMiddleware({ app });

    app.listen({ port: 4000 }, () =>
      console.log(
        `🚀 Server ready at http://localhost:${SERVER_PORT}${server.graphqlPath}`
      )
    );
  } catch (error) {
    console.log(error);
  }
}

start();
