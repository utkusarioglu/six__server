import mockKnex from 'mock-knex';
import postgres from '../../connectors/postgres';
mockKnex.mock(postgres);
import postCommentStore from './post-comment';
import { PostCommentModel } from './post-comment.types';
import { createTableCheck } from '../../helpers/tests';

const tracker = mockKnex.getTracker();

describe(`
  Package: store
  Module: PostComment
  Class: PostCommentStore
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

        const columns: PostCommentModel = {
          id: '',
          post_id: '',
          comment_id: '',
        };

        createTableCheck(columns, query);
      }
      query.response({ rows: [] });
    });

    await postCommentStore.createTable();
    expect(queryHit).toBe(1);

    done();
  });
});
