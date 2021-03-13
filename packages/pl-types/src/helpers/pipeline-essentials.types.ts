export type DataNodeEssentials = {
  /** In values */
  In: Record<keyof any, any>;
  /** In values translated using translations */
  InT: Record<keyof any, any>;
  /** Properties added during the node */
  Joins: Record<keyof any, any>;
  /** Properties added during the node with translated keys */
  JoinsT: Record<keyof any, any>;
  /** Split literals that are given as input */
  SplitLiterals: keyof any;
  /** Split properties */
  Splits: Record<keyof any, any>;
  /** Split properties with translated keys */
  SplitsT: Record<keyof any, any>;
  /** translation properties given as params */
  Translations: Record<keyof any, any>;
  /** out values without translations */
  Out: Record<keyof any, any>;
  /** out values with translation */
  OutT: Record<keyof any, any>;
};

export type PipelineEssentials = {
  _insert: DataNodeEssentials;
  _db: DataNodeEssentials;
};
