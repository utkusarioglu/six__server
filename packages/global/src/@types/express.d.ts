import type { SuccessfulUserLoginRes } from 'six__public-api';

/**
 * User properties that will be available to Express.user
 *
 * @todo
 * ! This type shall be derived from UserModel instead of being a standalone type
 */
export type UserProps = SuccessfulUserLoginRes;

/**
 * Alter user type for express with the user properties for the app
 */
declare global {
  namespace Express {
    interface User extends UserProps {}

    interface Request {
      user: UserProps;
    }
  }
}

export {};
