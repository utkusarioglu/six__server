/**
 * Properties needed for the User store insert operation
 */

export interface UserInsert {
  id?: string;
  username: string;
  password: string;
  email: string;
  age: number;
}
