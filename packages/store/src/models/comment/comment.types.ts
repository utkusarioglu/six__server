import type { CommentPipeline, CommentEndpoint } from 'six__public-api';
import { BuildPrepareInsert } from '../model/types/model.types';

export type { CommentPipeline };
export type CommentInput = CommentPipeline['_insert']['In'];
export type CommentPrepareInsert = BuildPrepareInsert<CommentPipeline>;

/**
 * Shape of return when Comments for a particular post is being returned
 */
export type CommentsForPostSlug = CommentEndpoint['_single']['_v1']['_get']['_res']['Success']['body'];
