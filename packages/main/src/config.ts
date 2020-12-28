const { NODE_HTTP_PORT, NODE_ALLOWED_ORIGINS } = process.env;

if (!NODE_HTTP_PORT)
  throw new Error('.env/NODE_HTTP_PORT is a required by main package');
if (!NODE_ALLOWED_ORIGINS)
  throw new Error('.env/NODE_ALLOWED_ORIGINS is required by main package');

export const HTTP_PORT = NODE_HTTP_PORT;
export const ALLOWED_ORIGINS = NODE_ALLOWED_ORIGINS.split(',');
