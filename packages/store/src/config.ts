const {
  POSTGRES_PASSWORD,
  POSTGRES_USER,
  POSTGRES_DB,
  NODE_ENV: NODE_APP_ENV,
} = process.env;

const isRequired = ((packageName: string) => (variableName: string) =>
  `.env/${variableName} is required by ${packageName}`)('server__store');

if (!POSTGRES_PASSWORD) throw new Error(isRequired('POSTGRES_PASSWORD'));
if (!POSTGRES_USER) throw new Error(isRequired('POSTGRES_USER'));
if (!POSTGRES_DB) throw new Error(isRequired('POSTGRES_DB'));
if (!NODE_APP_ENV) throw new Error(isRequired('NODE_APP_ENV'));

export const PG_PASSWORD = POSTGRES_PASSWORD;
export const PG_USER = POSTGRES_USER;
export const PG_DB = POSTGRES_DB;
export const NODE_ENV = NODE_APP_ENV;
