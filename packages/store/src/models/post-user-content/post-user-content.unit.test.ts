import mockKnex from 'mock-knex';
import postgres from '../../connectors/postgres';
mockKnex.mock(postgres);
import postUserContentStore from './post-user-content';
import { PostUserContentPipeline } from './post-user-content.types';
import { createTableCheck } from '../../helpers/tests';

const tracker = mockKnex.getTracker();

describe(`
  Package: store
  Module: PostUserContent
  Class: PostUserContentStore
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

        const columns: PostUserContentPipeline['_db']['Out'] = {
          id: '',
          post_id: '',
          user_content_id: '',
        };

        createTableCheck(columns, query);
      }
      query.response({ rows: [] });
    });

    await postUserContentStore.createTable();
    expect(queryHit).toBe(1);

    done();
  });
});
