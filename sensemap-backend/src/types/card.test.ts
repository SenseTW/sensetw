import * as C from './card';
import { context } from '../context';
import { maps } from '../../seeds/dev';

const { db } = context();
beforeEach(() => db.seed.run());
afterAll(() => db.destroy());

test('Card result fields', async () => {
  const id = maps[0].cards[0].id;
  const c = await C.resolvers.Query.Card(null, { id }, { db }, null);
  expect(c.objects.length).toBeGreaterThanOrEqual(0);
});

test('createCard result fields', async () => {
  const mapId = maps[0].id;
  const c0 = await C.resolvers.Mutation.createCard(null, {
    cardType: 'NORMAL',
    mapId,
  }, { db });
  expect(c0.id).toBeTruthy();
  expect(c0.objects).toEqual([]);
  expect(c0.map).toBe(mapId);

  const c1 = await C.resolvers.Mutation.deleteCard(null, { id: c0.id }, { db });
  expect(c1.id).toBe(c0.id);
});

describe('getAllCards', () => {
  test('no filters', async () => {
    const cs = await C.getAllCards(db);
    expect(cs.length).toBe(3);
  });

  test('filter by map', async () => {
    const cs = await C.getAllCards(db, { filter: { map: { id: 'b2f73daf-e767-4d8d-9506-52589d4fd039' } } });
    expect(cs.length).toBe(2);
  });

  test('filter by url', async () => {
    const cs = await C.getAllCards(db, { filter: { url: 'http://example.com' } });
    expect(cs.length).toBe(2);
  });

  test('filter by tags', async () => {
    const cs = await C.getAllCards(db, { filter: { tags: 'foo' } });
    expect(cs.length).toBe(1);
  });

  test('skip/limit/orderBy', async () => {
    const cs = await C.getAllCards(db, { skip: 1, limit: 1, orderBy: ['updatedAt', 'asc'] });
    expect(cs.length).toBe(1);
    expect(cs[0].id).toBe('61cfcfc1-1336-4f55-93ba-446bb8eedd4f');
  });
});
