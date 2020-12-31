const {
  SERVER_SESSION_SECRET,
  AUTH_USERNAME_LENGTH_MIN,
  AUTH_USERNAME_LENGTH_MAX,
  AUTH_PASSWORD_LENGTH_MIN,
  AUTH_PASSWORD_LENGTH_MAX,
} = process.env;

if (!SERVER_SESSION_SECRET)
  throw new Error('.env/NODE_SESSION_SECRET is required by auth package');

if (!AUTH_USERNAME_LENGTH_MIN)
  throw new Error('.env/AUTH_USERNAME_LENGTH_MIN is required by auth package');

if (!AUTH_USERNAME_LENGTH_MAX)
  throw new Error('.env/AUTH_USERNAME_LENGTH_MAX is required by auth package');

if (!AUTH_PASSWORD_LENGTH_MIN)
  throw new Error('.env/AUTH_PASSWORD_LENGTH_MIN is required by auth package');

if (!AUTH_PASSWORD_LENGTH_MAX)
  throw new Error('.env/AUTH_PASSWORD_LENGTH_MAX is required by auth package');

export const SESSION_SECRET = SERVER_SESSION_SECRET;
export const USERNAME_LENGTH_MIN = +AUTH_USERNAME_LENGTH_MIN;
export const USERNAME_LENGTH_MAX = +AUTH_USERNAME_LENGTH_MAX;
export const PASSWORD_LENGTH_MIN = +AUTH_PASSWORD_LENGTH_MIN;
export const PASSWORD_LENGTH_MAX = +AUTH_PASSWORD_LENGTH_MAX;
