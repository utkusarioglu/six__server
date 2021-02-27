import validator from 'validator';
import {
  USERNAME_LENGTH_MIN,
  USERNAME_LENGTH_MAX,
  PASSWORD_LENGTH_MIN,
  PASSWORD_LENGTH_MAX,
} from 'six__server__global';

/**
 * Checks whether the username given fails within the accepted username
 * length parameters
 * These parameters are supplied through the environment variables
 * @param username username string to check
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

/**
 * Checks whether the password given is up to the strength standards
 * This function doesn't check length because length check is handled
 * by {@link passwordLengthValid}.
 * @param password password to check
 */
export function passwordStrengthAcceptable(password: string): boolean {
  return validator.isStrongPassword(password, {
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
  });
}

/**
 * Checks whether the given email string is valid
 * @param email email string to check
 */
export function isValidEmail(email: string): boolean {
  return validator.isEmail(email);
}

/**
 * Checks if the given number is within reasonable human age limits
 * @param age age to check
 */
export function isValidAge(age: number): boolean {
  return 0 < age && age < 120;
}
