import Knex from 'knex';
import { PG_DB, PG_PASSWORD, PG_USER } from 'six__server__global';

const postgres = Knex({
  client: 'postgres',
  connection: {
    host: 'postgres',
    user: PG_USER,
    password: PG_PASSWORD,
    database: PG_DB,
  },
});

export default postgres;
