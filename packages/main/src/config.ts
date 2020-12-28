const { NODE_HTTP_PORT } = process.env;

if (!NODE_HTTP_PORT)
  throw new Error('NODE_HTTP_PORT is a required environment variable');

export const HTTP_PORT = NODE_HTTP_PORT;
