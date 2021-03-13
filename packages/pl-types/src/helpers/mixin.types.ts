import type { uuid } from './alias.types';

/**
 * MIXINS
 */
/**
 * Includes id: uuid in the type
 */

export type WithId = { id: uuid };

/**
 * Mixin for response error state
 */
export type WithError = {
  state: 'fail';
  errors: Partial<{
    [field: string]: string;
  }>;
};

/**
 * Mixin for request id
 */
export type WithRequestId = { requestId: string };
