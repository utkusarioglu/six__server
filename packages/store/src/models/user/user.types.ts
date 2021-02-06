import type { UserSignupPostReq, UserSqlAutoSave } from 'six__public-api';

/**
 * Properties needed for the User store insert operation
 */
export interface UserInsert {
  /**
   * ! Remove this before production
   */
  id: string;

  username: UserSignupPostReq['req']['username'];
  password: UserSignupPostReq['req']['password'];
  email: UserSignupPostReq['req']['email'];
  age: UserSignupPostReq['req']['age'];
}

export interface UserSqlAutoInsert {
  id: UserSqlAutoSave['id'];
}

export type UserModel = UserInsert & UserSqlAutoInsert;
