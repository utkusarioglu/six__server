import type {
  UserSignupIn,
  UserSingupResponseErrors,
} from 'six__server__ep-types';
import {
  passwordLengthValid,
  passwordStrengthAcceptable,
  isValidEmail,
  isValidAge,
  usernameLengthValid,
} from './single';

/**
 * validates the signup body parameters
 * @param param0 UserEndpoint singup request body
 */
export function validateSingupProps({
  username,
  password,
  email,
  age,
}: UserSignupIn): UserSingupResponseErrors {
  const errors: UserSingupResponseErrors = {};

  if (!usernameLengthValid(username)) {
    errors.username = 'USERNAME_LENGTH_ILLEGAL';
  }

  if (!passwordLengthValid(password)) {
    errors.password = 'PASSWORD_LENGTH_ILLEGAL';
  }

  if (!passwordStrengthAcceptable(password)) {
    errors.password = 'PASSWORD_WEAK';
  }

  if (!isValidEmail(email)) {
    errors.email = 'EMAIL_INVALID';
  }

  if (!isValidAge(age)) {
    errors.age = 'AGE_INVALID';
  }

  return errors;
}
