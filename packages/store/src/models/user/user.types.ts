import type { UserPostReq, UserSqlAutoSave } from 'six__public-api';

/**
 * Properties needed for the User store insert operation
 */
export interface UserInsert {
  /**
   * ! Remove this before production
   */
  id?: string;

  username: UserPostReq['req']['username'];
  password: UserPostReq['req']['password'];
  email: UserPostReq['req']['email'];
  age: UserPostReq['req']['age'];
}

export interface UserSqlAutoInsert {
  id: UserSqlAutoSave['id'];
}

export type UserModel = UserInsert & UserSqlAutoInsert;
