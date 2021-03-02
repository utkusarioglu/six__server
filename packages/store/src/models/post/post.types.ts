import type { PostEndpoint, PostPipeline } from 'six__public-api';
import { BuildPrepareInsert } from '../model/types/model.types';

export type { PostPipeline };

export type PostInput = PostPipeline['_insert']['In'];
export type PostSlug = PostPipeline['_insert']['Out']['slug'];
export type PostForCardSuccessBody = PostEndpoint['_single']['_v1']['_get']['_res']['Success']['body'];
export type PostPrepareInsert = BuildPrepareInsert<PostPipeline>;

/**
 * Db column mappings for Properties of for PostForCardSuccessBody
 */
export type PostColumns = Record<keyof PostForCardSuccessBody, string>;
