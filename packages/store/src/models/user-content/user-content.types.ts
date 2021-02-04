import { uuid } from '../../@types/helpers';

export interface UserContentInsert {
  filename: string; // path
  type: string; // mime type
}

export interface UserContentSqlAutoInsert {
  id: uuid;
}

export type UserContentModel = UserContentInsert & UserContentSqlAutoInsert;
