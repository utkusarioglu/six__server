import type { CommentForPostId } from 'six__server__ep-types';
import type { CommentUpPl } from 'six__server__pl-types';
import type { ColumnMapping } from '../../helpers/model/model.types';
import { InsertPrepareIn, InsertPrepareOut } from '../../@types/insert-prepare';

export type { CommentUpPl };

/**
 * Shape of return when Comments for a particular post is being returned
 */
export type CommentForPostIdColumns = ColumnMapping<CommentForPostId>;

/**
 * In
 */
export type CommentInsertPrepareIn = InsertPrepareIn<CommentUpPl>;
export type CommentInsertPrepareOut = InsertPrepareOut<CommentUpPl>;
