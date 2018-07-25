import * as U from './user';
import { context } from '../context';
import { users } from '../../seeds/dev';

const { db } = context();
beforeEach(() => db.seed.run());
afterAll(() => db.destroy());

const nonExistentID = '0be4e68e-c0f8-41a3-bffd-f3d430cd9822';

test('createUser', async () => {
  const { db } = context({ req: null });
  const u0 = await U.createUser(db, { username: 'foo', email: 'foo@example.com' }, 'mysecret');

  expect(u0.id).toBeTruthy();
  expect(u0.username).toBe('foo');
  expect(u0.email).toBe('foo@example.com');

  const u1 = await U.getUser(db, u0.id);
  expect(u1.id).toBe(u0.id);
});

test('getUser not found', async () => {
  const { db } = context({ req: null });
  const u0 = await U.getUser(db, nonExistentID);
  expect(u0).toBeNull();
});

test('updateUserPassword', async () => {
  const { db } = context({ req: null });
  const u0 = await U.createUser(db, { username: 'foo', email: 'foo@example.com' }, 'mysecret');

  const s0 = await db.select('salthash').from('user').where('id', u0.id).first();
  expect(s0.salthash).toMatch(/^\$2a\$08\$/);

  await U.updateUserPassword(db, u0.id, 'myothersecret');
  const s1 = await db.select('salthash').from('user').where('id', u0.id).first();
  expect(s1.salthash).toMatch(/^\$2a\$08\$/);
  expect(s1.salthash).not.toBe(s0.salthash);
});

test('authenticate', async () => {
  const { db } = context({ req: null });
  const u0 = await U.createUser(db, { username: 'foo', email: 'foo@example.com' }, 'mysecret');

  const u1 = await U.authenticate(db, u0.username, 'mysecret');
  expect(u1.id).toBe(u0.id);

  const u2 = await U.authenticate(db, u0.username, 'wrongsecret');
  expect(u2).toBeNull();
});

test('token', async () => {
  const token0 = U.generate_token('mysitesecret', { id: nonExistentID, version: 1337 });
  expect(token0.length > 64).toBeTruthy();

  //const token1 = U.generate_token(nonExistentID, 'mysitesecret');
  //expect(token1).not.toBe(token0);

  const data = U.decrypt_token('mysitesecret', token0);
  expect(data.id).toBe(nonExistentID);
  expect(data.version).toBe(1337);
  expect(data.expire).toBeTruthy();
});

test('checkUsername', () => {
  expect(U.checkUsername('ab')).toBe('Username must be between 3 and 30 characters.');
  expect(U.checkUsername('32aaaaaaaaaaaaaabbbbbbbbbbbbbbbb')).toBe('Username must be between 3 and 30 characters.');
  expect(U.checkUsername('foo-bar')).toBe('Username must contain only letters, numbers, periods, and underscores.');
  expect(U.checkUsername('the_42_awesome.monkeys')).toBe('');
});

describe('GraphQL', () => {
  test('User fields', async () => {
    const u = await U.resolvers.Query.User(null, { id: users[0].id }, { db });
    expect(u.id).toBe(users[0].id);
    expect(u.email).toBe('hello@somewhere');
    expect(u.maps).toBeTruthy();
  });
});
