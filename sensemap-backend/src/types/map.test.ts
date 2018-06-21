import * as M from './map';
import * as O from './object';
import { maps } from '../../seeds/dev';
import { context } from '../context';

const { db } = context({ req: null });

beforeAll(async () => {
  db.seed.run();
});

test.skip('getMap', async () => {
  const map = await M.getMap(db, maps[0].id);
  expect(map.objects).toContain(maps[0].objects[0].id);
  expect(map.cards).toContain(maps[0].cards[0].id);
  expect(map.boxes).toContain(maps[0].boxes[0].id);
  expect(map.edges).toContain(maps[0].edges[0].id);
});

test.skip('getObjectsInMap', async () => {
  const objects = await M.getObjectsInMap(db, maps[0].id);
  expect(objects[0].map).toEqual(maps[0].id);
});
