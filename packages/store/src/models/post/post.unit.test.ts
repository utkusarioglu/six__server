import mockKnex from 'mock-knex';
import postgres from '../../connectors/postgres';
mockKnex.mock(postgres);
import postStore from './post';
import {
  PostPipeline,
  PostPrepareInsert,
  PostForCardSuccessBody,
} from './post.types';
import { createTableCheck, getSqlColumns } from '../../helpers/tests';
import post from './post';
import _ from 'lodash';
import Chance from 'chance';

const tracker = mockKnex.getTracker();
const chance = Chance();
const requestColumns: PostForCardSuccessBody = {
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

        const columns: PostPipeline['_db']['Out'] = {
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

  it('Inserts post as expected', async (done) => {
    let queryHit = 0;

    const postInsert: PostPrepareInsert['insert'] = {
      title: chance.sentence(),
      body: chance.paragraph(),
      // cover_image_path: chance.url(),
      // user_id: chance.guid(),
      // community_id: chance.guid(),
      slug: chance.word(),
    };

    tracker.on('query', (query) => {
      if (query.sql.startsWith('insert into "posts"')) {
        queryHit++;
        console.log('hit');
      }
      query.response({ rows: [] });
    });

    await post.createTable();
    await post._insert(postInsert);
    expect(queryHit).toBe(1);

    done();
  });
});
