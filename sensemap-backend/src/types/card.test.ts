import * as C from './card';
import { context } from '../context';
import { maps } from '../../seeds/dev';

const { db } = context({ req: null });

beforeAll(async () => db.seed.run());

describe('GraphQL', () => {
  test('Card result fields', async () => {
    const id = maps[0].cards[0].id;
    const c = await C.resolvers.Query.Card(null, { id }, { db }, null);
    expect(c.objects.length).toBeGreaterThanOrEqual(0);
  });

  test('createCard result fields', async () => {
    const mapId = maps[0].id;
    const c = await C.resolvers.Mutation.createCard(null, {
      cardType: 'NORMAL',
      mapId,
    }, { db }, null);
    expect(c.id).toBeTruthy();
    expect(c.objects).toEqual([]);
    expect(c.map).toBe(mapId);
  });
});
