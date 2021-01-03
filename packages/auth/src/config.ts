const {
  SERVER_SESSION_SECRET,
  AUTH_USERNAME_LENGTH_MIN,
  AUTH_USERNAME_LENGTH_MAX,
  AUTH_PASSWORD_LENGTH_MIN,
  AUTH_PASSWORD_LENGTH_MAX,
  SECURE_SCHEMES: NODE_SECURE_SCHEMES,
} = process.env;

const isRequired = ((packageName: string) => (variableName: string) =>
  `.env/${variableName} is required by ${packageName}`)('server__auth');

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

export const SESSION_SECRET = SERVER_SESSION_SECRET;
export const USERNAME_LENGTH_MIN = +AUTH_USERNAME_LENGTH_MIN;
export const USERNAME_LENGTH_MAX = +AUTH_USERNAME_LENGTH_MAX;
export const PASSWORD_LENGTH_MIN = +AUTH_PASSWORD_LENGTH_MIN;
export const PASSWORD_LENGTH_MAX = +AUTH_PASSWORD_LENGTH_MAX;
export const SECURE_SCHEMES = NODE_SECURE_SCHEMES !== 'FALSE' ? true : false;
