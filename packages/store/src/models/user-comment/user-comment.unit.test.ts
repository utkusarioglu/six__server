import mockKnex from 'mock-knex';
import postgres from '../../connectors/postgres';
mockKnex.mock(postgres);
import userCommentStore from './user-comment';
import { UserCommentModel } from './user-comment.types';
import { createTableCheck } from '../../helpers/tests';

const tracker = mockKnex.getTracker();

describe(`
  Package: store
  Module: UserComment
  Class: UserCommentStore
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

        const columns: UserCommentModel = {
          id: '',
          user_id: '',
          comment_id: '',
        };

        createTableCheck(columns, query);
      }
      query.response({ rows: [] });
    });

    await userCommentStore.createTable();
    expect(queryHit).toBe(1);

    done();
  });
});
