import mockKnex from 'mock-knex';
import _ from 'lodash';

/**
 * Abstracts away the common aspects of table creation checking.
 *
 * @remarks
 * Method retrieves the column names from the sql statement prepared by
 * the createTable method and compares this to the columns object that
 * is used for preparing the statement.
 *
 * @param columns columns map that will be compared to the query
 * @param query query object from mock-knex
 */
export function createTableCheck<T>(columns: T, query: mockKnex.QueryDetails) {
  const modelColumns = Object.keys(columns);

  modelColumns.forEach((col) => {
    expect(query.sql).toContain(col);
  });

  /** Get the section between ( ) where the column definitions should be */
  const columnDefinitions = query.sql.match(/\((.*)\)/g) || [];

  /**
   * fail means that the retrieval of the columns section of
   * the table failed
   */
  expect(columnDefinitions?.length).toBe(1);

  const sqlStatementColumns = columnDefinitions[0]
    .split(',')
    // get the column name from between quote marks
    .map((col) => col.match(/"(.*)"/)?.pop());

  const columnsDifference = _.difference(sqlStatementColumns, modelColumns);

  // value other than 0 means that there is a mismatch
  // between the shape of the model and the createTable command
  expect(columnsDifference.length).toBe(0);
}

export function getSqlColumns(selectColumnMatch: RegExpMatchArray) {
  return (
    selectColumnMatch[1]
      // remove "
      .split('"')
      .join('')
      // split by commas
      .split(/,|(?:left join)|(?:join)|(?:right join)|(?:inner join)/)
      // .split(',')
      .map((col) =>
        col
          // split by "as" and trim results
          .replace('AS', 'as')
          .split('as')
          .map((c) => c.trim())
          // get the item after as, or the first item, if there is no 'as'
          .pop()
          // split the table name if there is one and get the column name
          ?.split('.')
          .pop()
      )
      // sort the whole thing for comparison
      .sort()
  );
}
