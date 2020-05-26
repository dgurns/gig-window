import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const typeOrmConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'postgres',
  synchronize: false,
  logging: false,
  entities: ['./src/entities/*.ts'],
};

export { typeOrmConfig };
