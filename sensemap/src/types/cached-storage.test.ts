import { objectId } from './utils';
import * as O from './sense/object';
import * as E from './sense/edge';
import * as S from './storage';
import * as CS from './cached-storage';

const obj0 = O.objectData({ id: objectId() });
const obj1 = O.objectData({ id: objectId() });
const edge0 = { ...E.emptyEdge, id: objectId(), from: obj0.id, to: obj0.id };
const edge1 = { ...edge0, to: obj1.id };
const storage = {
  [CS.TargetType.PERMANENT]: {
    ...S.initial,
    objects: { [obj0.id]: obj0, [obj1.id]: obj1 },
    edges: { [edge0.id]: edge0 },
  },
  [CS.TargetType.TEMPORARY]: S.initial,
};
const modified = {
  [CS.TargetType.PERMANENT]: {
    ...S.initial,
    objects: { [obj0.id]: obj0, [obj1.id]: obj1 },
  },
  [CS.TargetType.TEMPORARY]: {
    ...S.initial,
    edges: { [edge1.id]: edge1 },
  }
};

describe('types', () => {
  describe('CachedStorage', () => {
    describe('scoped', () => {
      it('should filter the chached storage', () => {
        expect(CS.scoped(storage, key => key === obj0.id))
          .toEqual({
            [CS.TargetType.PERMANENT]: {
              ...S.initial,
              objects: { [obj0.id]: obj0 },
              edges: { [edge0.id]: edge0 },
            },
            [CS.TargetType.TEMPORARY]: S.initial,
          });
      });

      it('should filter a cached storage with a new edge', () => {
        expect(CS.scoped(modified, key => key === obj0.id || key === obj1.id)).
          toEqual({
            [CS.TargetType.PERMANENT]: {
              ...S.initial,
              objects: { [obj0.id]: obj0, [obj1.id]: obj1 },
            },
            [CS.TargetType.TEMPORARY]: {
              ...S.initial,
              edges: { [edge1.id]: edge1 },
            }
          });
      });
    });
  });
});