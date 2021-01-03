const {
  SERVER_HTTP_PORT,
  SERVER_ALLOWED_ORIGINS,
  NODE_ENV: NODE_APP_ENV,
} = process.env;

if (!SERVER_HTTP_PORT)
  throw new Error('.env/SERVER_HTTP_PORT is a required by main package');

if (!SERVER_ALLOWED_ORIGINS)
  throw new Error('.env/SERVER_ALLOWED_ORIGINS is required by main package');

if (!NODE_APP_ENV) throw new Error('.env/NODE_ENV is required by server store');

export const HTTP_PORT = SERVER_HTTP_PORT;
export const ALLOWED_ORIGINS = SERVER_ALLOWED_ORIGINS.split(',');
export const NODE_ENV = NODE_APP_ENV;
