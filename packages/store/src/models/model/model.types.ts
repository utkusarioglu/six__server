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
  connector: any;
}
