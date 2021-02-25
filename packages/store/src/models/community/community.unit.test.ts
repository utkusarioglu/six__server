import mockKnex from 'mock-knex';
import postgres from '../../connectors/postgres';
mockKnex.mock(postgres);
import communityStore from './community';
import { CommunityPipeline } from './community.types';
import { createTableCheck } from '../../helpers/tests';

const tracker = mockKnex.getTracker();

describe(`
  Package: store
  Module: Community
  Class: CommunityStore
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

        const columns: CommunityPipeline['_db']['Out'] = {
          id: '',
          description: '',
          name: '',
          slug: '',
          created_at: '',
          post_count: 0,
          subscriber_count: 0,
        };

        createTableCheck(columns, query);
      }
      query.response({ rows: [] });
    });

    await communityStore.createTable();
    expect(queryHit).toBe(1);

    done();
  });
});
