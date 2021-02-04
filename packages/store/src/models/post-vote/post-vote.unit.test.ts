import mockKnex from 'mock-knex';
import postgres from '../../connectors/postgres';
mockKnex.mock(postgres);
import postVoteStore from './post-vote';
import { PostVoteModel } from './post-vote.types';
import { createTableCheck } from '../../helpers/tests';

const tracker = mockKnex.getTracker();

describe(`
  Package: store
  Module: PostVote
  Class: PostVoteStore
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

        const columns: PostVoteModel = {
          id: '',
          post_id: '',
          vote_id: '',
        };

        createTableCheck(columns, query);
      }
      query.response({ rows: [] });
    });

    await postVoteStore.createTable();
    expect(queryHit).toBe(1);

    done();
  });
});
