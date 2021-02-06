import mockKnex from 'mock-knex';
import postgres from '../../connectors/postgres';
mockKnex.mock(postgres);
import userStore from './user';
import { UserModel } from './user.types';
import { createTableCheck } from '../../helpers/tests';
import user from './user';
import Chance from 'chance';

const tracker = mockKnex.getTracker();
const chance = Chance();

describe(`
  Package: store
  Module: User
  Class: UserStore
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

        const columns: UserModel = {
          id: '',
          username: '',
          password: '',
          email: '',
          age: 0,
        };

        createTableCheck(columns, query);
      }
      query.response({ rows: [] });
    });

    await userStore.createTable();
    expect(queryHit).toBe(1);

    done();
  });

  it('Can build functioning user select query', async (done) => {
    let queryHit = 0;
    const usernameColumn: keyof UserModel = 'username';
    const randomUsername: UserModel['username'] = chance.word();

    tracker.on('query', (query) => {
      if (query.sql.toUpperCase().startsWith('SELECT * FROM "USERS"')) {
        queryHit++;

        expect(query.sql).toContain(usernameColumn);
        expect(query.bindings).toContain(randomUsername);
      }
      query.response({ rows: [] });
    });

    await user.createTable();
    await user.selectByEmail(randomUsername);

    expect(queryHit).toBe(1);

    done();
  });

  it('Returns false when no user is found', async (done) => {
    let queryHit = 0;
    const randomUsername = chance.word();

    tracker.on('query', (query) => {
      if (query.sql.toUpperCase().startsWith('SELECT * FROM "USERS"')) {
        queryHit++;
      }
      query.response({ rows: [] });
    });

    await user.createTable();
    const userList = await user.selectByEmail(randomUsername);

    expect(userList).toBe(false);
    expect(queryHit).toBe(1);

    done();
  });

  it('Returns user if only one user is found', async (done) => {
    let queryHit = 0;

    const randomUser: UserModel = {
      id: chance.guid(),
      username: chance.word(),
      password: chance.word(),
      email: chance.email(),
      age: chance.age(),
    };

    tracker.on('query', (query) => {
      if (query.sql.toUpperCase().startsWith('SELECT * FROM "USERS"')) {
        queryHit++;
        query.response([randomUser]);
      } else {
        query.response({ rows: [] });
      }
    });

    await user.createTable();
    const userList = await user.selectByEmail(randomUser.username);

    expect(userList).toStrictEqual(randomUser);
    expect(queryHit).toBe(1);

    done();
  });

  it('Returns false if more than one user is found', async (done) => {
    let queryHit = 0;

    const randomUsers: UserModel[] = Array(3).fill({
      id: chance.guid(),
      username: chance.word(),
      password: chance.word(),
      email: chance.email(),
      age: chance.age(),
    });

    tracker.on('query', (query) => {
      if (query.sql.toUpperCase().startsWith('SELECT * FROM "USERS"')) {
        queryHit++;
        query.response(randomUsers);
      } else {
        query.response({ rows: [] });
      }
    });

    await user.createTable();
    const userList = await user.selectByEmail(randomUsers[0].username);

    expect(userList).toStrictEqual(false);
    expect(queryHit).toBe(1);

    done();
  });
});
