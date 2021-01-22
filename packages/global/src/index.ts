const {
  SERVER_HTTP_PORT,
  SERVER_ALLOWED_ORIGINS,
  NODE_ENV: NODE_APP_ENV,
  SERVER_SESSION_SECRET,
  AUTH_USERNAME_LENGTH_MIN,
  AUTH_USERNAME_LENGTH_MAX,
  AUTH_PASSWORD_LENGTH_MIN,
  AUTH_PASSWORD_LENGTH_MAX,
  SECURE_SCHEMES: NODE_SECURE_SCHEMES,
  POSTGRES_PASSWORD,
  POSTGRES_USER,
  POSTGRES_DB,
} = process.env;

const isRequired = ((packageName: string) => (variableName: string) =>
  `.env/${variableName} is required by ${packageName}`)('server');

if (!SERVER_HTTP_PORT) throw new Error(isRequired('SERVER_HTTP_PORT'));
if (!NODE_APP_ENV) throw new Error(isRequired('NODE_APP_ENV'));
if (!SERVER_ALLOWED_ORIGINS)
  throw new Error(isRequired('SERVER_ALLOWED_ORIGINS'));

if (!SERVER_SESSION_SECRET)
  throw new Error(isRequired('SERVER_SESSION_SECRET'));

if (!AUTH_USERNAME_LENGTH_MIN)
  throw new Error(isRequired('AUTH_USERNAME_LENGTH_MIN'));

if (!AUTH_USERNAME_LENGTH_MAX)
  throw new Error(isRequired('AUTH_USERNAME_LENGTH_MAX'));

if (!AUTH_PASSWORD_LENGTH_MIN)
  throw new Error(isRequired('AUTH_PASSWORD_LENGTH_MIN'));

if (!AUTH_PASSWORD_LENGTH_MAX)
  throw new Error(isRequired('AUTH_PASSWORD_LENGTH_MAX'));

if (!NODE_SECURE_SCHEMES) throw new Error(isRequired('NODE_SECURE_SCHEMES'));

if (!POSTGRES_PASSWORD) throw new Error(isRequired('POSTGRES_PASSWORD'));
if (!POSTGRES_USER) throw new Error(isRequired('POSTGRES_USER'));
if (!POSTGRES_DB) throw new Error(isRequired('POSTGRES_DB'));

export const HTTP_PORT = SERVER_HTTP_PORT;
export const ALLOWED_ORIGINS = SERVER_ALLOWED_ORIGINS.split(',');
export const NODE_ENV = NODE_APP_ENV;
export const SESSION_SECRET = SERVER_SESSION_SECRET;
export const USERNAME_LENGTH_MIN = +AUTH_USERNAME_LENGTH_MIN;
export const USERNAME_LENGTH_MAX = +AUTH_USERNAME_LENGTH_MAX;
export const PASSWORD_LENGTH_MIN = +AUTH_PASSWORD_LENGTH_MIN;
export const PASSWORD_LENGTH_MAX = +AUTH_PASSWORD_LENGTH_MAX;
export const SECURE_SCHEMES = NODE_SECURE_SCHEMES !== 'FALSE' ? true : false;
export const PG_PASSWORD = POSTGRES_PASSWORD;
export const PG_USER = POSTGRES_USER;
export const PG_DB = POSTGRES_DB;
