import mockKnex from 'mock-knex';
import postgres from '../../connectors/postgres';
mockKnex.mock(postgres);
import voteStore from './vote.model';
import { VoteUpPl } from './vote.model.types';
import { createTableCheck } from '../../helpers/tests';

const tracker = mockKnex.getTracker();

describe(`
  Package: store
  Module: Vote
  Class: VoteStore
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

        const columns: VoteUpPl['_db']['OutT'] = {
          id: '',
          created_at: '',
          vote_type: -1,
        };

        createTableCheck(columns, query);
      }
      query.response({ rows: [] });
    });

    await voteStore.createTable();
    expect(queryHit).toBe(1);

    done();
  });
});
