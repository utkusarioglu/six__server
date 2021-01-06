import { NODE_ENV } from '../config';

/**
 * Returns false if NODE_ENV is set to production
 *
 * @usage
 * ````ts
 * return blockInProduction() && postgres('users').del()
 * ````
 *
 * Hence allowing the query to be ignored if it's called on production
 */
export function blockInProduction(): boolean {
  if (NODE_ENV === 'production') {
    console.warn('this method is set to be ignored in production');
    return false;
  }
  return true;
}
