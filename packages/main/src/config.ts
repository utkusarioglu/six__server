const { SERVER_HTTP_PORT, SERVER_ALLOWED_ORIGINS } = process.env;

if (!SERVER_HTTP_PORT)
  throw new Error('.env/SERVER_HTTP_PORT is a required by main package');

if (!SERVER_ALLOWED_ORIGINS)
  throw new Error('.env/SERVER_ALLOWED_ORIGINS is required by main package');

export const HTTP_PORT = SERVER_HTTP_PORT;
export const ALLOWED_ORIGINS = SERVER_ALLOWED_ORIGINS.split(',');
