import mockKnex from 'mock-knex';
import postgres from '../../connectors/postgres';
mockKnex.mock(postgres);
import communityPostStore from './community-post';
import { CommunityPostPipeline } from './community-post.types';
import { createTableCheck } from '../../helpers/tests';

const tracker = mockKnex.getTracker();

describe(`
  Package: store
  Module: CommunityPost
  Class: CommunityPostStore
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

        const columns: CommunityPostPipeline['_db']['Out'] = {
          id: '',
          post_id: '',
          community_id: '',
        };

        createTableCheck(columns, query);
      }
      query.response({ rows: [] });
    });

    await communityPostStore.createTable();
    expect(queryHit).toBe(1);

    done();
  });
});
