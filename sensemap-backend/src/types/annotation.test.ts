import * as A from './annotation';
import { maps, annotations } from '../../seeds/dev';
import { context } from '../context';

const { db } = context();
beforeEach(() => db.seed.run());
afterAll(() => db.destroy());

test('getAnnotation', async () => {
  const a0 = await A.getAnnotation(db, annotations[0].id);
  expect(a0.id).toBeTruthy();
  expect(a0.mapId).toBeTruthy();
  expect(a0.target[0].source).toBeTruthy();
});

test('create/update/delete', async () => {
  const a0 = await A.createAnnotation(db, {
    mapId: maps[0].id,
    target: [
      {
        "source": "https://example.com/",
        "selector": [
          {
            "conformsTo": "https://tools.ietf.org/html/rfc3236",
            "type": "FragmentSelector",
            "value": "content"
          },
        ]
      }
    ],
  });
  expect(a0.id).toBeTruthy();
  expect(a0.target[0].selector[0].type).toBe('FragmentSelector');

  const a1 = await A.updateAnnotation(db, a0.id, {
    target: [
      {
        "source": "https://foobar.com/",
        "selector": [
          {
            "endContainer": "/main[1]/div[2]/div[1]/div[1]/div[3]/p[1]",
            "startContainer": "/main[1]/div[2]/div[1]/div[1]/div[3]/p[1]",
            "type": "RangeSelector",
            "startOffset": 0,
            "endOffset": 74,
          },
        ]
      },
    ],
  });
  expect(a1.target[0].selector[0].type).toBe('RangeSelector');

  const a2 = await A.deleteAnnotation(db, a0.id);
  const a3 = await A.getAnnotation(db, a0.id);
  expect(a3).toBeNull();
});
