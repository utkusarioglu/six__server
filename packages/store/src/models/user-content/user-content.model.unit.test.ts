import mockKnex from 'mock-knex';
import postgres from '../../connectors/postgres';
mockKnex.mock(postgres);
import userContentStore from './user-content.model';
import { UserContentUpPl } from './user-content.model.types';
import { createTableCheck } from '../../helpers/tests';

const tracker = mockKnex.getTracker();

describe(`
  Package: store
  Module: UserContent
  Class: UserContentStore
  Environment: test
`, () => {
  beforeEach(() => {
    tracker.install();
  });

  afterEach(() => {
    tracker.uninstall();
  });

  it('Creates the table with the expected specs', async (done) => {
    let queryHit = 0;
    tracker.on('query', (query) => {
      if (query.sql.toUpperCase().startsWith('CREATE TABLE')) {
        queryHit++;

        const columns: UserContentUpPl['_db']['OutT'] = {
          id: '',
          filename: '',
          type: '',
        };

        createTableCheck(columns, query);
      }
      query.response({ rows: [] });
    });

    await userContentStore.createTable();
    expect(queryHit).toBe(1);

    done();
  });
});
