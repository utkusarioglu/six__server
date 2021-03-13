import type { MapKeys } from './map-keys.types';
import type { RecordAny } from './alias.types';

/**
 * Handles the data transformations for a single data node
 */
export type DataNode<
  /** Properties that go into a node */
  In extends RecordAny,
  /** Properties added to the object before it's sent to the next node */
  Auto extends RecordAny = {},
  /** Properties removed from the data object before it's sent to the next node */
  SplitLiterals extends keyof (In & Auto) = never,
  /** Translations made to the property names */
  Translations extends Record<keyof Translations, keyof any> = {}
> = {
  /** In values */
  In: In;
  /** In values translated using translations */
  InT: MapKeys<In, Translations>;
  /** Properties added during the node */
  Joins: Auto;
  /** Properties added during the node with translated keys */
  JoinsT: MapKeys<Auto, Translations>;
  /** Split literals that are given as input */
  SplitLiterals: SplitLiterals;
  /** Split properties */
  Splits: Pick<In & Auto, SplitLiterals>;
  /** Split properties with translated keys */
  SplitsT: MapKeys<Pick<In & Auto, SplitLiterals>, Translations>;
  /** translation properties given as params */
  Translations: Translations;
  /** out values without translations */
  Out: Omit<In & Auto, SplitLiterals>;
  /** out values with translation */
  OutT: MapKeys<Omit<In & Auto, SplitLiterals>, Translations>;
};
