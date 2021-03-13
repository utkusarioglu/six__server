import mockKnex from 'mock-knex';
import postgres from '../../connectors/postgres';
mockKnex.mock(postgres);
import commentStore from './comment.model';
import { CommentUpPl } from './comment.model.types';
import { createTableCheck } from '../../helpers/tests';

const tracker = mockKnex.getTracker();

describe(`
  Package: store
  Module: Comment
  Class: CommentStore
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
    tracker.on('query', (query, step) => {
      if (query.sql.toUpperCase().startsWith('CREATE TABLE')) {
        queryHit++;

        const columns: Omit<CommentUpPl['_db']['OutT'], 'post_id'> = {
          parent_id: '',
          body: '',
          id: '',
          created_at: '',
          like_count: 0,
          dislike_count: 0,
        };

        createTableCheck(columns, query);
      }
      query.response({ rows: [] });
    });

    await commentStore.createTable();
    expect(queryHit).toBe(1);

    done();
  });
});
