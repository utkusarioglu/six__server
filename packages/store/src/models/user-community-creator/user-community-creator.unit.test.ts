import mockKnex from 'mock-knex';
import postgres from '../../connectors/postgres';
mockKnex.mock(postgres);
import userCommunityCreatorStore from './user-community-creator';
import { UserCommunityCreatorModel } from './user-community-creator.types';
import { createTableCheck } from '../../helpers/tests';

const tracker = mockKnex.getTracker();

describe(`
  Package: store
  Module: UserCommunityCreator
  Class: UserCommunityCreatorStore
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

        const columns: UserCommunityCreatorModel = {
          id: '',
          user_id: '',
          community_id: '',
        };

        createTableCheck(columns, query);
      }
      query.response({ rows: [] });
    });

    await userCommunityCreatorStore.createTable();
    expect(queryHit).toBe(1);

    done();
  });
});
