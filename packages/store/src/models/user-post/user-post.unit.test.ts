import mockKnex from 'mock-knex';
import postgres from '../../connectors/postgres';
mockKnex.mock(postgres);
import userPostStore from './user-post';
import { UserPostPipeline } from './user-post.types';
import { createTableCheck } from '../../helpers/tests';

const tracker = mockKnex.getTracker();

describe(`
  Package: store
  Module: UserPost
  Class: UserPostStore
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

        const columns: UserPostPipeline['_db']['Out'] = {
          id: '',
          user_id: '',
          post_id: '',
        };

        createTableCheck(columns, query);
      }
      query.response({ rows: [] });
    });

    await userPostStore.createTable();
    expect(queryHit).toBe(1);

    done();
  });
});
