import type { UserPipeline } from 'six__public-api';

export type { UserPipeline };

/**
 * User input email alias
 */
export type UserEmail = UserPipeline['_insert']['Out']['email'];
