import type Knex from 'knex';
import { NODE_ENV } from '../../config';
import { ModelProps } from './model.types';

/**
 * Provides common methods and connector access to instances of entities
 * Every store class, named as <noun>Store extends this class to gain
 * access to their respective databases
 *
 */
export abstract class Model<Insert> {
  /** singular name for the entity */
  protected _singular: string;
  /** Plural name for the entity, this is used as the table name */
  protected _plural: string;
  /** database connector built by {@link Knex} */
  protected _db: Knex<any, any[]>;
  /** Shorthand for knex.schema */
  private _schema: Knex.SchemaBuilder;

  /**
   * Instantiates the Model abstract class
   * @param modelProps properties required for instantiating Model
   */
  constructor(modelProps: ModelProps) {
    const { singular, plural, connector } = modelProps;

    this._singular = singular;
    this._plural = plural;
    this._db = connector;
    this._schema = this._db.schema;
  }

  /**
   * Unified error handler for all {@link Knex} based Model operations
   * @param err error string coming from Knex
   */
  protected _errorHandler(err: string) {
    console.error(`Model error:\n${err}`);
  }

  /**
   * A wrapper for Knex table builder. This method handles checking for the
   * existence of tables before creation and error handling. The consumer
   * stores only need to define the structure of the table as shown below:
   *
   * @example
   * ```ts
   * async createTable() {
   *   return this._createTable((t) => {
   *     t.uuid('id').primary();
   *     t.string('username');
   *     t.string('password');
   *     t.string('email');
   *  });
   * }
   * ```
   *
   * @param tableBuilder callback function for creating the structure of the
   * table.
   *
   * @privateRemarks
   * Note that the table only checks whether a able with the name
   * {@link Model.plural} exists, it does not check the structure of the said
   * table. This may cause issues if it's not accounted for.
   */
  protected async _createTable(
    tableBuilder: (tableBuilder: Knex.CreateTableBuilder) => any
  ) {
    if (await this._schema.hasTable(this._plural)) return;

    return this._schema.createTable(this._plural, tableBuilder);
  }

  /**
   * Wrapper for {@link Knex} queryBuilder. This method also attaches the
   * error handler to every instance. Consuming class only needs to define
   * the callback for proper use of the method
   *
   * @example
   * ```ts
   * async selectByUsername(username: string): Promise<User | false> {
   *  return this._queryBuilder((table) => {
   *    return table.where({ username })
   *  });
   * }
   * ```
   */
  protected async _queryBuilder(
    queryBuilder: (queryBuilder: Knex.QueryBuilder) => Promise<any>
  ) {
    return queryBuilder(this._getTable()).catch(this._errorHandler);
  }

  /**
   * Returns the table responsible for storing that specific entity's data
   */
  protected _getTable() {
    return this._db(this._plural);
  }

  /**
   * Returns the connector used for connecting the model to a database
   */
  protected _getConnector() {
    return this._db;
  }

  /**
   * Selects all the entries in the respective table
   */
  async selectAll() {
    return this._getTable().select('*').catch(this._errorHandler);
  }

  /**
   * Applies SQL's truncate method on the respective table
   */
  async truncate() {
    return this._blockInProduction() && this._getTable().truncate();
  }

  /**
   * Applies a delete operation on the respective table
   */
  async deleteAll() {
    return (
      this._blockInProduction() &&
      this._getTable().del().catch(this._errorHandler)
    );
  }

  /**
   * Inserts into the respective table
   * @param inserts data to be inserted, defined by the Insert generic type
   * defined by the particular instance
   */
  async insert(inserts: Insert) {
    return this._getTable().insert(inserts).catch(this._errorHandler);
  }

  /**
   * Returns false if NODE_ENV is set to production
   *
   * @usage
   * ````ts
   * return this._blockInProduction() && this._table.del()
   * ````
   *
   * Hence allowing the query to be ignored if it's called on production
   */
  protected _blockInProduction(): boolean {
    if (NODE_ENV === 'production') {
      console.warn('this method is set to be ignored in production');
      return false;
    }
    return true;
  }
}
