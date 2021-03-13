import type { MapKeys } from './map-keys.types';

/**
 * Type hierarchy for creating types for data journey from persistence to client
 */
export type BuildSelect<
  Pipeline extends { _db: { OutT: Record<string, any> } },
  Native extends keyof Pipeline['_db']['OutT'] = keyof Pipeline['_db']['OutT'],
  Foreign extends {} = {},
  Rename extends Record<keyof Rename, keyof any> = {}
> = {
  /**
   * Properties that will be selected from the model
   */
  Native: Pick<Pipeline['_db']['OutT'], Native>;

  /**
   * Properties added to the return from some other data sources that are
   * not auto-created
   */
  Foreign: Foreign;

  /**
   * Returns the list of all the selected properties
   */
  Select: MapKeys<Pick<Pipeline['_db']['OutT'], Native> & Foreign, Rename>;
};
