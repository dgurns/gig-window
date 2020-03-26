import 'reflect-metadata';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { createConnection } from 'typeorm';
import { buildSchema } from 'type-graphql';
import depthLimit from 'graphql-depth-limit';

import { BookResolver } from 'resolvers/BookResolver';

async function start() {
  try {
    const connection = await createConnection();
    const schema = await buildSchema({
      resolvers: [BookResolver]
    });

    const server = new ApolloServer({
      schema,
      validationRules: [depthLimit(7)]
    });

    const app = express();
    app.use('*', cors());
    app.use(compression());

    server.applyMiddleware({ app });

    app.listen({ port: 4000 }, () =>
      console.log(
        `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
      )
    );
  } catch (error) {
    console.log(error);
  }
}

start();
