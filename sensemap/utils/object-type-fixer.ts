#!/usr/bin/env ts-node
import { MapID, ObjectType } from '../src/types';
import * as GO from '../src/types/graphql/object';
import { anonymousUser } from '../src/types/session';

const mapId: MapID = 'cjgdo1yhj0si501559s0hgw2a';

const fixObjects =
  (objects: GO.GraphQLObjectFields[]): GO.GraphQLObjectFields[] => {
    let illed = [];

    for (const o of objects) {
      if (o.card && o.objectType !== 'CARD') {
        illed.push({ ...o, objectType: 'CARD' });
      }
      if (o.box && o.objectType !== 'BOX') {
        illed.push({ ...o, objectType: 'BOX' });
      }
    }

    return illed;
  };

// main
(async () => {
  const objects = await GO.loadRawObjects(anonymousUser, mapId);
  const fixed = fixObjects(objects);

  if (fixed.length === 0) {
    // tslint:disable-next-line:no-console
    console.log('Every objects are ok.');
    return;
  }

  const ps =
    fixed.map(({ id, objectType }) =>
      GO.updateObjectType(anonymousUser, id, objectType as ObjectType));
  await Promise.all(ps);

  // tslint:disable-next-line:no-console
  console.log('All objects should be fixed.');
})();
