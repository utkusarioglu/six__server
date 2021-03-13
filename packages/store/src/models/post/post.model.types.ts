import type { PostDetailsOut } from 'six__server__ep-types';
import type { PostUpPl } from 'six__server__pl-types';
import type { ColumnMapping } from '../../helpers/model/model.types';
import type {
  InsertPrepareIn,
  InsertPrepareOut,
} from '../../@types/insert-prepare';

export type { PostUpPl };

export type PostInsertPrepareIn = InsertPrepareIn<PostUpPl>;
export type PostInsertPrepareOut = InsertPrepareOut<PostUpPl>;
export type PostSlug = PostUpPl['_insert']['OutT']['slug'];

/**
 * Db column mappings for Properties of for PostForCardSuccessBody
 */
export type PostColumns = ColumnMapping<PostDetailsOut>;
