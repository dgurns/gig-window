import { createConnection } from 'typeorm';

export const connectToDatabase = async () => {
  await createConnection({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT ?? ''),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: {
      rejectUnauthorized: false,
    },
    logging: false,
    entities: [__dirname + '/entities/*'],
    synchronize: false,
    migrationsRun: true,
    migrations: [__dirname + '/migrations/*'],
    cli: {
      migrationsDir: __dirname + '/migrations',
    },
  });
};
