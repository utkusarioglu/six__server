const { NODE_SERVER_HTTP_PORT, NODE_SERVER_ALLOWED_ORIGINS } = process.env;

if (!NODE_SERVER_HTTP_PORT)
  throw new Error('.env/SERVER_HTTP_PORT is a required by main package');

if (!NODE_SERVER_ALLOWED_ORIGINS)
  throw new Error('.env/SERVER_ALLOWED_ORIGINS is required by main package');

export const HTTP_PORT = NODE_SERVER_HTTP_PORT;
export const ALLOWED_ORIGINS = NODE_SERVER_ALLOWED_ORIGINS.split(',');
