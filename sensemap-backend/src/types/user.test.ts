import * as dotenv from 'dotenv';
dotenv.config()

import * as U from './user';
import { context } from '../context';

// XXX hack
const nonExistentUUID = '0be4e68e-c0f8-41a3-bffd-f3d430cd9822';

async function clearUserTable {
  const { db } = context({ req: null });
  await db('user').delete();
}

afterEach(async () => {
  await clearUserTable();
});

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
  const u0 = await U.getUser(db, nonExistentUUID);
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
  const token0 = U.generate_token('mysitesecret', { id: nonExistentUUID, version: 1337 });
  expect(token0.length > 64).toBeTruthy();

  //const token1 = U.generate_token(nonExistentUUID, 'mysitesecret');
  //expect(token1).not.toBe(token0);

  const data = U.decrypt_token('mysitesecret', token0);
  expect(data.id).toBe(nonExistentUUID);
  expect(data.version).toBe(1337);
  expect(data.expire).toBeTruthy();
});
