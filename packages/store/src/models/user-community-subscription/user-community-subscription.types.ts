import type { UserCommunitySubscriptionPipeline } from 'six__public-api';
import { BuildPrepareInsert } from '../model/types/model.types';

export type { UserCommunitySubscriptionPipeline };

export type UCSInput = UserCommunitySubscriptionPipeline['_insert']['In'];
export type UCSPrepareInsert = BuildPrepareInsert<UserCommunitySubscriptionPipeline>;
export type UCSUserId = UserCommunitySubscriptionPipeline['_db']['Out']['user_id'];
export type UCSCommunityId = UserCommunitySubscriptionPipeline['_db']['Out']['community_id'];
