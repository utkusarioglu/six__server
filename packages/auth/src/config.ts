const { SERVER_SESSION_SECRET } = process.env;

if (!SERVER_SESSION_SECRET)
  throw new Error('.env/NODE_SESSION_SECRET is required by auth package');

export const SESSION_SECRET = SERVER_SESSION_SECRET;
