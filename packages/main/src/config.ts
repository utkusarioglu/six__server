const {
  SERVER_HTTP_PORT,
  SERVER_ALLOWED_ORIGINS,
  NODE_ENV: NODE_APP_ENV,
} = process.env;

const isRequired = ((packageName: string) => (variableName: string) =>
  `.env/${variableName} is required by ${packageName}`)('server__main');

if (!SERVER_HTTP_PORT) throw new Error(isRequired('SERVER_HTTP_PORT'));
if (!NODE_APP_ENV) throw new Error(isRequired('NODE_APP_ENV'));
if (!SERVER_ALLOWED_ORIGINS)
  throw new Error(isRequired('SERVER_ALLOWED_ORIGINS'));

export const HTTP_PORT = SERVER_HTTP_PORT;
export const ALLOWED_ORIGINS = SERVER_ALLOWED_ORIGINS.split(',');
export const NODE_ENV = NODE_APP_ENV;
