import mockKnex from 'mock-knex';
import postgres from '../../connectors/postgres';
mockKnex.mock(postgres);
import postStore from './post';
import { PostInsert, PostModel } from './post.types';
import { createTableCheck, getSqlColumns } from '../../helpers/tests';
import post from './post';
import _ from 'lodash';
import type { PostGetResInternal } from './post.types';
import Chance from 'chance';

const tracker = mockKnex.getTracker();
const chance = Chance();
const requestColumns: PostGetResInternal['res'] = {
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

        // @ts-ignore
        const columns: PostModel = {
          id: '',
          title: '',
          body: '',
          slug: '',
          dislike_count: 0,
          like_count: 0,
          unique_commenter_count: 0,
          comment_count: 0,
          created_at: '',
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
    await post.selectUserPosts('user-id');
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
    await post.selectVisitorPosts();
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
    await post.selectPostBySlug('some random id');
    expect(queryHit).toBe(1);

    done();
  });

  it.skip('Inserts post as expected', async (done) => {
    let queryHit = 0;

    const postInsert: PostInsert = {
      title: chance.sentence(),
      body: chance.paragraph(),
      cover_image_path: chance.url(),
      user_id: chance.guid(),
      community_id: chance.guid(),
    };

    tracker.on('query', (query) => {
      if (query.sql.startsWith('insert into "posts"')) {
        queryHit++;
        console.log('hit');
      }
      console.log(query.sql);
      query.response({ rows: [] });
    });

    await post.createTable();
    await post.insert(postInsert);
    expect(queryHit).toBe(1);

    done();
  });
});
