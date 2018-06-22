import * as M from './map';
import * as O from './object';
import { maps } from '../../seeds/dev';
import { context } from '../context';

const nonexistent = '10330ced-04b4-46d3-91a6-1d294bb12da3';

const { db } = context({ req: null });

beforeAll(async () => db.seed.run());

describe('GraphQL', () => {
  test('Map result fields', async () => {
    const map = await M.resolvers.Query.Map(null, { id: maps[0].id }, { db }, null);
    expect(map.id).toBe(maps[0].id);
    expect(map.createdAt).toBeTruthy();
    expect(map.updatedAt).toBeTruthy();
    expect(map.objects).toContain(maps[0].objects[0].id);
    expect(map.cards).toContain(maps[0].cards[0].id);
    expect(map.boxes).toContain(maps[0].boxes[0].id);
    expect(map.edges).toContain(maps[0].edges[0].id);
  });

  test('create/get/delete Map', async () => {
    const m0 = await M.resolvers.Mutation.createMap(null, {}, { db }, null);
    expect(m0.id).toBeTruthy();
    expect(m0.createdAt).toBeTruthy();
    expect(m0.updatedAt).toBeTruthy();

    const m1 = await M.resolvers.Query.Map(null, { id: m0.id }, { db }, null);
    expect(m1.id).toBe(m0.id);
    expect(m1.createdAt).toEqual(m0.createdAt);
    expect(m1.updateAt).toEqual(m0.updateAt);

    const m2 = await M.resolvers.Mutation.deleteMap(null, { id: m0.id }, { db }, null);
    expect(m2.id).toBe(m0.id);
    const r2 = await M.resolvers.Query.Map(null, { id: m0.id }, { db }, null);
    expect(r2).toBeNull();
  });

  test('allMaps', async () => {
    const ms = await M.resolvers.Query.allMaps(null, {}, { db }, null);
    expect(ms.length).toBeGreaterThan(1);
  });

  test('allMaps null result', async () => {
    const ms = await M.resolvers.Query.allMaps(null, { filter: { id: nonexistent } }, { db }, null);
    expect(ms.length).toBe(0);
  });
});


test('getObjectsInMap', async () => {
  const objects = await M.getObjectsInMap(db, maps[0].id);
  expect(objects[0].map).toEqual(maps[0].id);
});
