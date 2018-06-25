import * as B from './box';
import * as O from './object';
import { maps, boxes } from '../../seeds/development';
import { context } from '../context';

const { db } = context({ req: null });

beforeAll(async () => db.seed.run());

test('getBox', async () => {
  const box = await B.getBox(db, boxes[0].id);
  expect(box.id).toEqual(boxes[0].id);
  expect(box.map).toEqual(boxes[0].map);
});

test('addToContainCards', async () => {
  const box = await B.createBox(db, {
    mapId: maps[0].id,
  });
  const obj = await O.createObject(db, {
    mapId: maps[0].id,
    objectType: 'CARD',
  });
  expect(box.contains).toEqual([]);

  const r1 = await B.resolvers.Mutation.addToContainCards(null, {
    containsObjectId: obj.id,
    belongsToBoxId: box.id,
  }, { db });

  const b1 = await B.getBox(db, box.id);
  expect(b1.contains).toEqual([ obj.id ]);
  expect(r1.containsObject).toBe(obj.id);
  expect(r1.belongsToBox).toBe(box.id);

  const r2 = await B.resolvers.Mutation.removeFromContainCards(null, {
    containsObjectId: obj.id,
    belongsToBoxId: box.id,
  }, { db });

  const b2 = await B.getBox(db, box.id);
  expect(b2.contains).toEqual([]);
  expect(r2.containsObject).toBe(obj.id);
  expect(r2.belongsToBox).toBe(box.id);
});
