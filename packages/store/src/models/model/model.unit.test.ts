import Chance from 'chance';
import { ERROR_MESSAGES } from './model.constants';
import {
  MockStore,
  tracker,
  mockPostgres,
  MockStoreModel,
  MockStoreInsert,
} from './__mock__/mock-store';
import _ from 'lodash';
import { createTableCheck } from '../../helpers/tests';

let mockStore: MockStore | null;
const chance = Chance();

/**
 * TESTS THAT NEED TO BE WRITTEN
 *
 * _col method
 */

describe(`
  Package: store
  Module: model
  Class: model
  Environment: test
`, () => {
  beforeEach(() => {
    tracker.install();
  });

  afterEach(() => {
    tracker.uninstall();
  });

  /**
   * Tests that need to check requirements before any connection is established
   * with the referenced table
   */
  describe('Before db connection', () => {
    /**
     * Checks whether the instance correctly uses the singular
     * and plural strings that it receives during instantiation
     */
    it('Assigns singular, plural and tableName', async (done) => {
      const mockSingular = chance.word();
      const mockPlural = chance.word();

      mockStore = new MockStore({
        singular: mockSingular,
        plural: mockPlural,
        connector: mockPostgres,
      });

      const tableName = mockStore.getTableName();
      const plural = mockStore.getPlural();
      const singular = mockStore.getSingular();

      expect(tableName).toStrictEqual(mockPlural);
      expect(plural).toStrictEqual(mockPlural);
      expect(singular).toStrictEqual(mockSingular);

      done();
    });

    /**
     * If properly implemented, any method that tries to access the table
     * should go through the method _getTable.
     *
     * This method contains a boolean check whether the _createTable method
     * has been called before. If not, _getTable should throw an error and
     * halt the table access.
     *
     * This test checks whether the any pipeline that reaches the table is
     * blocked unless _createTable was called prior.
     */
    it('Throws error if table is called without creation', async (done) => {
      mockStore = new MockStore({
        singular: 'singular',
        plural: 'plural',
        connector: mockPostgres,
      });

      expect(mockStore.selectAll.bind(mockStore)).rejects.toEqual(
        Error(ERROR_MESSAGES.PREMATURE_TABLE_CALL)
      );

      expect(mockStore.truncate.bind(mockStore)).rejects.toEqual(
        Error(ERROR_MESSAGES.PREMATURE_TABLE_CALL)
      );

      expect(mockStore.deleteAll.bind(mockStore)).rejects.toEqual(
        Error(ERROR_MESSAGES.PREMATURE_TABLE_CALL)
      );

      expect(mockStore._insert.bind(mockStore)).rejects.toEqual(
        Error(ERROR_MESSAGES.PREMATURE_TABLE_CALL)
      );

      done();
    });
  });

  describe('Before table creation', () => {
    beforeEach(() => {
      mockStore = new MockStore({
        singular: 'singular',
        plural: 'plural',
        connector: mockPostgres,
      });
    });

    afterEach(() => {
      mockStore = null;
    });

    /**
     * For this mock model, this test doesn't make much sense but it's here
     * as a demonstration of how it can be ensured that all the columns defined
     * in the model interface can be checked to be implemented
     */
    it('Creates table with all the fields in the model', async (done) => {
      mockStore = mockStore as MockStore;
      let queryHit = 0;

      tracker.on('query', (query) => {
        if (query.sql.toUpperCase().startsWith('CREATE TABLE')) {
          queryHit++;

          const columns: MockStoreModel = {
            id: 0,
            name: '',
            lastName: '',
            age: 0,
          };

          createTableCheck(columns, query);
        }
        query.response({ rows: [] });
      });

      await mockStore.createTable();
      expect(queryHit).toBe(1);

      done();
    });

    it('Can halt on error', () => {
      const errorMessage = chance.paragraph();
      expect(() =>
        (mockStore as MockStore).errorHandlerWrapper(errorMessage)
      ).toThrow(
        new Error(ERROR_MESSAGES.MODEL_ERROR.replace('$1', errorMessage))
      );
    });
  });

  describe('With db connection', () => {
    beforeEach(() => {
      mockStore = new MockStore({
        singular: 'singular',
        plural: 'plural',
        connector: mockPostgres,
      });
    });

    afterEach(() => {
      mockStore = null;
    });

    /**
     * Model._blockInProduction method returns a boolean depending on the
     * value of the current app NODE_ENV config. Note that the class
     * doesn't listen to process.env, it listens to the NODE_ENV variable
     * from {@link six__server__global}
     *
     * This test checks whether the said method returns true and hence allows the
     * the actions that are blocked in production.
     *
     * This test has a production counterpart in the module
     * model.production.test.ts
     */
    it('Allows risky actions in test mode', () => {
      mockStore = mockStore as MockStore;

      const blockResponse = mockStore.blockInProductionWrapper();
      // In production, this should be equal to false, instead of true
      expect(blockResponse).toEqual(true);
    });

    it('Inserts with model default insert method', async (done) => {
      mockStore = mockStore as MockStore;

      let queryHit = 0;
      const insertion: MockStoreInsert = {
        name: 'name',
        lastName: 'lastName',
        age: 1,
      };

      tracker.on('query', (query, step) => {
        if (query.sql.toUpperCase().startsWith('INSERT')) {
          queryHit++;

          Object.entries(insertion).forEach(([property, value]) => {
            expect(query.sql).toContain(property);
            // check whether the values are listed in the bindings
            expect(query.bindings).toContain(value);
          });
        }
        query.response({ rows: [] });
      });

      await mockStore.createTable();
      await mockStore._insert(insertion);
      expect(queryHit).toBe(1);
      done();
    });

    /**
     * Model has a default selectAll method that should return all the
     * entries in the referenced table
     */
    it('Can insert an array of values', async (done) => {
      mockStore = mockStore as MockStore;
      let queryHit = 0;

      const insertions: MockStoreInsert[] = Array(10)
        .fill(null)
        .map((_) => ({
          name: chance.word(),
          lastName: chance.word(),
          age: chance.age(),
        }));

      tracker.on('query', (query) => {
        if (query.sql.toUpperCase().startsWith('INSERT')) {
          queryHit++;

          Object.keys(insertions[0]).forEach((col) => {
            expect(query.sql).toContain(col);
          });

          // check whether the values are listed in the bindings
          insertions.forEach((row) => {
            Object.values(row).forEach((property) => {
              expect(query.bindings).toContain(property);
            });
          });
        }
        query.response({ rows: [] });
      });

      await mockStore.createTable();
      await mockStore._insert(insertions);
      expect(queryHit).toBe(1);

      done();
    });

    it('Can Select all', async (done) => {
      mockStore = mockStore as MockStore;
      let queryHit = 0;

      tracker.on('query', (query) => {
        if (query.sql.toUpperCase().startsWith('SELECT * FROM "PLURAL"')) {
          queryHit++;
        }
        query.response({ rows: [] });
      });

      await mockStore.createTable();
      await mockStore.selectAll();
      expect(queryHit).toBe(1);

      done();
    });

    it('Can truncate', async (done) => {
      mockStore = mockStore as MockStore;
      let queryHit = 0;

      tracker.on('query', (query) => {
        if (query.sql.toUpperCase().startsWith('TRUNCATE "PLURAL"')) {
          queryHit++;
        }
        query.response({ rows: [] });
      });

      await mockStore.createTable();
      await mockStore.truncate();
      expect(queryHit).toBe(1);

      done();
    });

    it('Can deleteAll', async (done) => {
      mockStore = mockStore as MockStore;
      let queryHit = 0;
      tracker.on('query', (query, step) => {
        if (query.sql.toUpperCase().startsWith('DELETE')) {
          queryHit++;
          expect(query.sql.toUpperCase()).toContain('DELETE FROM "PLURAL"');
        }
        query.response({ rows: [] });
      });

      await mockStore.createTable();
      await mockStore.deleteAll();
      expect(queryHit).toBe(1);

      done();
    });
  });
});
