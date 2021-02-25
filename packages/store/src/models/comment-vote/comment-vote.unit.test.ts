import mockKnex from 'mock-knex';
import postgres from '../../connectors/postgres';
mockKnex.mock(postgres);
import commentVoteStore from './comment-vote';
import { CommentVotePipeline } from './comment-vote.types';
import { createTableCheck } from '../../helpers/tests';

const tracker = mockKnex.getTracker();

describe(`
  Package: store
  Module: CommentVote
  Class: CommentVoteStore
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

        const columns: CommentVotePipeline['_db']['Out'] = {
          id: '',
          vote_id: '',
          comment_id: '',
        };

        createTableCheck(columns, query);
      }
      query.response({ rows: [] });
    });

    await commentVoteStore.createTable();
    expect(queryHit).toBe(1);

    done();
  });
});
