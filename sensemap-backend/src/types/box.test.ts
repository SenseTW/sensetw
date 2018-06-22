import * as B from './box';
import { boxes } from '../../seeds/dev';
import { context } from '../context';

const { db } = context({ req: null });

beforeAll(async () => db.seed.run());

test('getBox', async () => {
  const box = await B.getBox(db, boxes[0].id);
  expect(box.id).toEqual(boxes[0].id);
  expect(box.map).toEqual(boxes[0].map);
});
