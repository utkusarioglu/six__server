const {
  POSTGRES_PASSWORD,
  POSTGRES_USER,
  POSTGRES_DB,
  NODE_ENV: NODE_APP_ENV,
} = process.env;

if (!POSTGRES_PASSWORD)
  throw new Error('.env/POSTGRES_PASSWORD is required by server store');

if (!POSTGRES_USER)
  throw new Error('.env/POSTGRES_USER is required by server store');

if (!POSTGRES_DB)
  throw new Error('.env/POSTGRES_DB is required by server store');

if (!NODE_APP_ENV) throw new Error('.env/NODE_ENV is required by server store');

export const PG_PASSWORD = POSTGRES_PASSWORD;
export const PG_USER = POSTGRES_USER;
export const PG_DB = POSTGRES_DB;
export const NODE_ENV = NODE_APP_ENV;
