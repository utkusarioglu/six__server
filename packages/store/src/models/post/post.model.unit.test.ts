import mockKnex from 'mock-knex';
import postgres from '../../connectors/postgres';
mockKnex.mock(postgres);
import postStore from './post.model';
import type { PostDetailsOut } from 'six__server__ep-types';
import { PostUpPl, PostInsertPrepareOut } from './post.model.types';
import { createTableCheck, getSqlColumns } from '../../helpers/tests';
import post from './post.model';
import _ from 'lodash';
import Chance from 'chance';

const tracker = mockKnex.getTracker();
const chance = Chance();
const requestColumns: PostDetailsOut = {
  id: '',
  createdAt: '',
  postTitle: '',
  postBody: '',
  postSlug: '',
  likeCount: 0,
  dislikeCount: 0,
  commentCount: 0,
  communitySlug: '',
  communityName: '',
  mediaImagePath: '',
  mediaType: 'none',
  creatorUsername: '',
  userVote: 0,
};

describe(`
  Package: store
  Module: Post
  Class: PostStore
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

        const columns: PostUpPl['_db']['OutT'] = {
          id: '',
          created_at: '',
          title: '',
          body: '',
          slug: '',
          dislike_count: 0,
          like_count: 0,
          comment_count: 0,
          // cover_image_path: '',
        };

        createTableCheck(columns, query);
      }
      query.response({ rows: [] });
    });

    await postStore.createTable();
    expect(queryHit).toBe(1);

    done();
  });

  it('Returns the right property names for user posts', async (done) => {
    let queryHit = 0;

    tracker.on('query', (query) => {
      if (query.sql.includes('from "posts"')) {
        queryHit++;

        /**
         * Retrieve the column names between SELECT and FROM
         */
        const selectColumnMatch = query.sql
          .replace(/(?:\r\n|\r|\n)/g, '')
          .match(/select (.*) from/);
        if (!selectColumnMatch) {
          return fail(`Failed to retrieve SELECT <columns> in\n ${query.sql}`);
        }

        const returnColumns = getSqlColumns(selectColumnMatch);
        const requestColumnKeys = Object.keys(requestColumns).sort();

        expect(requestColumnKeys).toStrictEqual(returnColumns);
      }
      query.response({ rows: [] });
    });

    await post.createTable();
    await post.selectPostFeedPostsByUserId('user-id');
    expect(queryHit).toBe(1);

    done();
  });

  it('returns the right property names for visitor posts', async (done) => {
    let queryHit = 0;

    tracker.on('query', (query) => {
      if (query.sql.includes('from "posts"')) {
        queryHit++;

        /**
         * Retrieve the column names between SELECT and FROM
         */
        const selectColumnMatch = query.sql.match(/select (.*) from/);
        if (!selectColumnMatch) {
          return fail('Failed to retrieve SELECT <columns>');
        }

        const returnColumns = getSqlColumns(selectColumnMatch);
        const requestColumnKeys = Object.keys(requestColumns).sort();

        expect(requestColumnKeys).toStrictEqual(returnColumns);
      }
      query.response({ rows: [] });
    });

    await post.createTable();
    await post.selectVisitorPostFeed();
    expect(queryHit).toBe(1);

    done();
  });

  it('Returns the right properties for single post selects', async (done) => {
    let queryHit = 0;

    tracker.on('query', (query) => {
      if (query.sql.includes('from "posts"')) {
        queryHit++;

        /**
         * Retrieve the column names between SELECT and FROM
         */
        const selectColumnMatch = query.sql.match(/select (.*) from/);
        if (!selectColumnMatch) {
          return fail('Failed to retrieve SELECT <columns>');
        }

        const returnColumns = getSqlColumns(selectColumnMatch);
        const requestColumnKeys = Object.keys(requestColumns).sort();

        expect(requestColumnKeys).toStrictEqual(returnColumns);
      }
      query.response({ rows: [] });
    });

    await post.createTable();
    await post.selectVisitorPostDetailsBySlug('some random id');
    expect(queryHit).toBe(1);

    done();
  });

  it('Inserts post as expected', async (done) => {
    let queryHit = 0;

    const postInsert: PostInsertPrepareOut = {
      title: chance.sentence(),
      body: chance.paragraph(),
      slug: chance.word(),
    };

    tracker.on('query', (query) => {
      if (query.sql.startsWith('insert into "posts"')) {
        queryHit++;
      }
      query.response({ rows: [] });
    });

    await post.createTable();
    await post._insert_old(postInsert);
    expect(queryHit).toBe(1);

    done();
  });
});
