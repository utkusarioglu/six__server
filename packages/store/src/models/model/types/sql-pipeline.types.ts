import Knex from 'knex';
import type { ValuesType } from 'utility-types';

/**
 * Computes Insert property from _store section of PipelineTypes type
 * hierarchy
 */
type SqlPipelineTypesInsertWithoutForeign<
  SqlInputs extends SqlPipelinePrototype
> = Omit<
  SqlPipelineTypesInsertWithForeign<SqlInputs>,
  ValuesType<SqlInputs['_store']['Foreign']>
>;

/**
 * Combines inputs and computed types
 */
type SqlPipelineTypesInsertWithForeign<
  SqlInputs extends SqlPipelinePrototype
> = SqlInputs['_store']['Input'] & SqlInputs['_store']['Computed'];

/**
 * Computes the inputs after removing the Foreign
 */
type SqlPipelineTypesInputAfterForeign<
  SqlInputs extends SqlPipelinePrototype
> = Omit<
  SqlInputs['_store']['Input'] & SqlInputs['_store']['Computed'],
  ValuesType<SqlInputs['_store']['Foreign']>
>;

/**
 * Creates a map of omitted properties type from the tuple input made to
 * OmitFromInsert
 */
type ForeignTypes<SqlInputs extends SqlPipelinePrototype> = Pick<
  SqlInputs['_store']['Input'],
  ValuesType<SqlInputs['_store']['Foreign']>
>;

/**
 * Computes Model property from PipelineTypes type hierarchy
 */
type SqlPipelineTypesModel<
  Inputs extends SqlPipelinePrototype
> = SqlPipelineTypesInsertWithoutForeign<Inputs> & Inputs['_db']['DefaultTo'];

/**
 * Input prototype for PipelineTypes
 */
interface SqlPipelinePrototype {
  _store: {
    /**
     * Properties that are coming from the request
     */
    Input: {};
    /**
     * Input coming from the request that shall be ignored, as a tuple
     */
    Foreign: any;
    /**
     * Computations done at the store layer. This may be something related
     * to session id for example.
     */
    Computed: {};
  };

  _db: {
    /**
     * Properties created by the default to settings of the db
     */
    DefaultTo: {};
  };
}

export type PipelineEssentials2 = {
  _request: { Final: any };
  _store: { _insert: { WithForeign: any } };
  _db: { Model: any };
};

export type DataNodeEssentials = {
  // In: Record<string, any>;
  // Translated: Record<string, any>;
  // Splits: Record<string, any>;
  // AfterSplit: Record<string, any>;
  // Joins: Record<string, any>;
  // Out: Record<string, any>;
  // OutWithSplit: Record<string, any>;

  In: Record<string, any>;
  Translated: Record<string, any>;
  Joins: Record<string, any>;
  AfterJoins: Record<string, any>;
  SplitLiterals: string;
  Splits: Record<string, any>;
  Out: Record<string, any>;
};

export type PipelineEssentials = {
  _insert: DataNodeEssentials;
  _db: DataNodeEssentials;
};

export type DefaultSqlPipeline = BuildSqlPipeline<
  any,
  PipelineEssentials2,
  SqlPipelinePrototype
>;

/**
 * Type hierarchy for data journey from request to persistence
 */
export type BuildSqlPipeline<
  Transaction extends any,
  Pipeline extends PipelineEssentials2,
  SqlInputs extends SqlPipelinePrototype
> = {
  _store: {
    _input: {
      WithForeign: SqlInputs['_store']['Input'];
      WithoutForeign: SqlPipelineTypesInputAfterForeign<SqlInputs>;
      Computed: SqlInputs['_store']['Computed'];
    };

    _foreign: {
      Types: ForeignTypes<SqlInputs>;
      // StringLiteral: ValuesType<SqlInputs['_store']['Foreign']>;
    };

    _insert: {
      WithForeign: SqlPipelineTypesInsertWithForeign<SqlInputs>;
      WithoutForeign: SqlPipelineTypesInsertWithoutForeign<SqlInputs>;
    };
  };

  _db: {
    DefaultTo: SqlInputs['_db']['DefaultTo'];
    Model: SqlPipelineTypesModel<SqlInputs>;
  };

  _model_generics: {
    SqlInsert: SqlPipelineTypesInputAfterForeign<SqlInputs>;
    SqlModel: SqlPipelineTypesModel<SqlInputs>;

    Input: Pipeline['_request']['Final'];
    InsertWithForeign: Pipeline['_store']['_insert']['WithForeign'];
    Model: Pipeline['_db']['Model'];

    PrepareInsert: {
      sqlInsert: SqlPipelineTypesInputAfterForeign<SqlInputs>;
      foreign: ForeignTypes<SqlInputs>;
    };

    InsertFunc: [
      Pipeline['_request']['Final'],
      (keyof SqlPipelineTypesModel<SqlInputs>)[],
      Transaction
    ];
  };
};

// type Changes = [
//   ['userId', 'user_id'],
//   ['postId', 'post_id'],
//   ['communityId', 'community_id']
// ];

// type Instance = RenameProperties<Model, Changes>;

// const ins: Instance = {
//   community_id: true,
//   user_id: 0,
//   post_id: '',
// };

// console.log(ins);
