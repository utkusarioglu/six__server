import mockKnex from 'mock-knex';
import postgres from '../../connectors/postgres';
mockKnex.mock(postgres);
import userCommunitySubscriptionStore from './user-community-subscription';
import { UserCommunitySubscriptionPipeline } from './user-community-subscription.types';
import { createTableCheck } from '../../helpers/tests';

const tracker = mockKnex.getTracker();

describe(`
  Package: store
  Module: UserCommunitySubscription
  Class: UserCommunitySubscriptionStore
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

        const columns: UserCommunitySubscriptionPipeline['_db']['Out'] = {
          id: '',
          user_id: '',
          community_id: '',
        };

        createTableCheck(columns, query);
      }
      query.response({ rows: [] });
    });

    await userCommunitySubscriptionStore.createTable();
    expect(queryHit).toBe(1);

    done();
  });
});
