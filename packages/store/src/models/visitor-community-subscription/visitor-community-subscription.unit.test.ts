import mockKnex from 'mock-knex';
import postgres from '../../connectors/postgres';
mockKnex.mock(postgres);
import visitorCommunitySubscriptionStore from './visitor-community-subscription';
import { VisitorCommunitySubscriptionPipeline } from './visitor-community-subscription.types';
import { createTableCheck } from '../../helpers/tests';

const tracker = mockKnex.getTracker();

describe(`
  Package: store
  Module: VisitorCommunitySubscription
  Class: VisitorCommunitySubscriptionStore
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

        const columns: VisitorCommunitySubscriptionPipeline['_db']['Out'] = {
          id: '',
          community_id: '',
        };

        createTableCheck(columns, query);
      }
      query.response({ rows: [] });
    });

    await visitorCommunitySubscriptionStore.createTable();
    expect(queryHit).toBe(1);

    done();
  });
});
