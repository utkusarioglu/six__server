import validator from 'validator';
import {
  USERNAME_LENGTH_MIN,
  USERNAME_LENGTH_MAX,
  PASSWORD_LENGTH_MIN,
  PASSWORD_LENGTH_MAX,
} from '../config';

/**
 * Checks if the username given falls within the accepted username
 * length parameters
 * These parameters are supplied through the environment variables
 * @param username username to check
 */
export function usernameLengthValid(username: string): boolean {
  return validator.isLength(username, {
    min: USERNAME_LENGTH_MIN,
    max: USERNAME_LENGTH_MAX,
  });
}

/**
 * Checks if the password given falls within the accepted password
 * length parameters
 * These parameters are supplied through the environment variables
 * @param password password to check
 */
export function passwordLengthValid(password: string): boolean {
  return validator.isLength(password, {
    min: PASSWORD_LENGTH_MIN,
    max: PASSWORD_LENGTH_MAX,
  });
}
