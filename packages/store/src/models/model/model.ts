import type Knex from 'knex';
import { NODE_ENV } from 'six__server__global';
import { ModelProps, CustomTableBuilder } from './model.types';
import { ERROR_MESSAGES } from './model.constants';
import _ from 'lodash';

/**
 * Provides common methods and connector access to instances of entities
 * Every store class, named as <noun>Store extends this class to gain
 * access to their respective databases
 *
 */
export abstract class Model<InstanceInsert, InstanceModel> {
  private _tableCreateCalled: boolean = false;

  /** singular name for the entity */
  protected _singular: string;

  /** Plural name for the entity, this is used as the table name */
  protected _plural: string;

  // TODO this type doesn't work, errors are disabled with ts-ignore
  /** database connector built by {@link Knex} */
  protected _db: Knex<InstanceInsert, InstanceModel[]>;

  /** Shorthand for knex.schema */
  private _schema: Knex.SchemaBuilder;
  private static _testTablePrefix = 'test_';

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
   * Returns the name of the table which the inheriting store instance writes
   * to. Table name changes according to the environment that the app is running
   * on. If NODE_ENV is set to testing, then the table name receives a
   * prefix as defined in the model properties.
   */
  public getTableName(): string {
    return this._plural;
  }

  /**
   * Returns the singular name set for the table
   */
  public getSingular(): string {
    return this._singular;
  }

  /**
   * Returns the plural name set for the table.
   * In current build, this method returns the same thing as
   * {@link getTableName}
   */
  public getPlural(): string {
    return this._plural;
  }

  /**
   * Unified error handler for all {@link Knex} based Model operations
   * @param err error string coming from Knex
   */
  protected _errorHandler(err: string) {
    throw new Error(ERROR_MESSAGES.MODEL_ERROR.replace('$1', err));
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
    tableBuilder: CustomTableBuilder<InstanceModel>
  ) {
    this._tableCreateCalled = true;
    if (await this._schema.hasTable(this._plural)) return;
    // !any
    return this._schema
      .createTable(this._plural, tableBuilder as any)
      .catch(this._errorHandler);
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
    // ! any
    queryBuilder: (queryBuilder: Knex.QueryBuilder) => Promise<any>
  ) {
    return queryBuilder(this._getTable()).catch(this._errorHandler);
  }

  /**
   * Returns the table responsible for storing that specific entity's data
   */
  protected _getTable() {
    if (!this._tableCreateCalled) {
      throw new Error(ERROR_MESSAGES.PREMATURE_TABLE_CALL);
    }
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
  async selectAll(): Promise<InstanceModel[] | void> {
    // @ts-ignore
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
  async insert(inserts: InstanceInsert | InstanceInsert[]) {
    // @ts-ignore
    return this._getTable().insert(inserts).catch(this._errorHandler);
  }

  /**
   * Returns false if NODE_ENV is set to anything other than development
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
      console.warn(ERROR_MESSAGES.BLOCK_IN_PRODUCTION);
      return false;
    }
    return true;
  }

  /**
   * Wrapper for the particular connector's raw method
   * @param rawString raw string to be used in the query
   */
  protected _raw(rawString: string) {
    return this._getConnector().raw(rawString);
  }

  /**
   * Returns current time for the particular connector
   */
  protected _now() {
    return this._getConnector().fn.now();
  }

  /**
   * @unused
   * Helper for defining column names. By default it converts the snake_case
   * column names to camelCase used in ts/js.
   *
   * It accepts operations such as col_name1 - col_name2 but the current
   * typings will discourage this. In case an operation expression is input
   * it will internally use knex.raw to process the column name. Also,
   * use of an operation will require the definition of "as" property in
   * the alterations.
   *
   * @param columnName desired column name, in case there is an operation
   * this line will yell at the user, this is intentional for now.
   * @param alterations an object that defines extra processing steps for the
   * "AS" expression in sql. It allows prefixing a string through the "pre"
   * property. Or the consumer can define a custom string using "as".
   */
  protected _col2(
    columnName: keyof InstanceModel,
    alterations: {
      as?: string;
      pre?: string;
    } = {}
  ): string | Knex.Raw {
    // check if the column name contains any special chars
    let asRaw = false;
    const processedColumnName = (columnName as string).split('.').pop();
    if (!processedColumnName) {
      throw new Error(
        ERROR_MESSAGES.COLUMN_NAME_ILLEGAL.replace('$1', columnName as string)
      );
    }

    // matches A-Z a-z 0-9 _ . everything else means that this is an operation,
    // not a single column name, even though sql specification allows more
    // complex column names, this algorithm will only allow these chars to
    // be used.
    if (!(columnName as string).match(/^(([A-Za-z0-9_.])+)$/)) {
      if (alterations.as === undefined) {
        throw new Error(
          ERROR_MESSAGES.AS_NEEDS_TO_BE_DEFINED.replace(
            '$1',
            processedColumnName
          )
        );
      }
      asRaw = true;
    }

    // check if there is a prefix given
    const prefix = alterations.pre !== undefined ? alterations.pre + '_' : '';

    const asFinal =
      alterations.as !== undefined
        ? _.camelCase(alterations.as)
        : _.camelCase(prefix + processedColumnName);

    // Notice that the raw query surrounds the AS string with double quotes
    return asRaw
      ? this._raw(`${columnName} AS "${asFinal}"`)
      : `${columnName} AS ${asFinal}`;
  }

  /**
   * Destroys the connection to the connector of the particular instance
   *
   * @remarks
   * This is a volatile function. Because of this, its execution is blocked
   * in production.
   */
  async destroyConnection() {
    return this._blockInProduction() && this._getConnector().destroy();
  }

  /**
   * Checks whether the class has access to the database
   * This is a hacky function that tries a select operation on the db
   * in order to determine whether the database responds
   *
   * @hack
   */
  async isConnected() {
    const connected = await this._raw('select 1 + 1 as result');
    return connected !== null;
  }

  /**
   * Tries to initialize the connection to the connector of the particular
   * store instance. You don't need to call this to initialize the store
   * when the app first runs as the very first initialization is done
   * automatically by knex.
   */
  async initializeConnection() {
    if (await this.isConnected()) {
      return Promise.resolve();
    }
    return this._getConnector().initialize();
  }
}
