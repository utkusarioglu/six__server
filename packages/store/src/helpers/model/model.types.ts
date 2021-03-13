import type { Overwrite } from 'utility-types';
import type { ColumnBuilder, CreateTableBuilder, Raw, Transaction } from 'knex';
import type { PipelineEssentials } from 'six__server__pl-types';
import type { MapKeys } from '../../@types/map-keys.types';

/**
 * Defines the properties that need to be provided to Model during
 * instantiation
 */
export interface ModelProps {
  /** Singular entity name */
  singular: string;
  /** Plural entity name, this one is used as the table name */
  plural: string;
  /** Knex connector to the database */
  connector: any; // !any
}

/**
 * @hack
 * Redefined table object properties to throw errors if any string other
 * than the keys of the Model instance have been input.
 *
 * @example
 * ```ts
 * table.uuid(<some wrong string>)
 * ```
 * this will throw an error saying that the string is not assignable to
 * the parameter of some union type
 *
 * ```ts
 * table.uuid(<string that is enlisted in model>)
 * ```
 * this will be silently accepted of course
 *
 * @remarks
 * This type helps with making sure that the column names input
 * are consistent with the model interface but this cannot check
 * whether all the model properties are defined by _createTable method
 * for now, these will require testing to be done.
 */
type CustomTableBuilderMethods<T> = Overwrite<
  CreateTableBuilder,
  {
    [method in keyof CreateTableBuilder]: (
      /**
       * This is the line where the actual change is being made.
       * Knex defines column names as strings, doesn't care wether the
       * model accepted as a generic contains the keys
       */
      columnName: keyof T,
      options?: any
    ) => ColumnBuilder;
  }
>;

/**
 * Custom table builder for checking column names across the model
 * properties. Please read documentation for {@link CustomTableBuilderMethods}
 * as well
 */
export type CustomTableBuilder<T> = (
  table: CustomTableBuilderMethods<T>
) => any;

export type BuildPrepareInsert<Pipeline extends PipelineEssentials> = {
  insert: Pipeline['_insert']['OutT'];
  foreign: Pipeline['_insert']['SplitsT'];
};

export type BuildInsertParams<Pipeline extends PipelineEssentials> = [
  Pipeline['_insert']['In'],
  (keyof Pipeline['_db']['OutT'])[],
  Transaction
];

/**
 * Creates object type for select columns that knex uses
 *
 * @example
 * ```ts
 * const columns: SelectColumns<{tableId: number, static: string}> = {
 *  tableId: 'some_table.some_id'
 *  static: this._raw("'some static value'")
 * }
 * ```
 * The type uses the keys of the Record that is given as the generic
 * and maps these to string and knex.Raw. This allows db column reference
 * with string and with knex raw method.
 */
export type ColumnMapping<
  Body extends Record<keyof any, any>,
  Translate extends Record<keyof any, keyof any> = {}
> = MapKeys<Record<keyof Body, string | Raw>, Translate>;

/**
 * Generic type for creating select rows
 */
export type PickSelectRows<
  DbOut extends PipelineEssentials = PipelineEssentials,
  Picks extends keyof any = never,
  Translate extends Record<keyof any, keyof any> = {}
> = MapKeys<Pick<DbOut['_db']['OutT'], Picks>, Translate>;
