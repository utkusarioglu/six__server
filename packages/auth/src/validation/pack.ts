import {
  passwordLengthValid,
  passwordStrengthAcceptable,
  isValidEmail,
  isValidAge,
  usernameLengthValid,
} from './single';
import { UserEndpoint } from 'six__public-api';

type UserEndpoint_singup_req_body = UserEndpoint['_signup']['_v1']['_post']['_req']['Body'];
type UserEndpoint_singup_res_errors = Partial<
  Record<keyof UserEndpoint_singup_req_body, string>
>;

/**
 * validates the signup body parameters
 * @param param0 UserEndpoint singup request body
 */
export function validateSingupProps({
  username,
  password,
  email,
  age,
}: UserEndpoint_singup_req_body): UserEndpoint_singup_res_errors {
  const errors: UserEndpoint_singup_res_errors = {};

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
