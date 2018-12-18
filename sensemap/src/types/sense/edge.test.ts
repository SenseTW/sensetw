import {
  EdgeType,
  emptyEdge,
  isEmpty,
  types,
  edgeType,
  edgeTitle,
  edgeTags,
  edgeSummary,
} from './edge';

describe('types', () => {
  describe('Edge', () => {
    describe('functions', () => {
      it('should check if an edge is empty or not', () => {
        const empty = { ...emptyEdge };
        expect(isEmpty(empty)).toBe(true);
        const noneEmpty = { ...emptyEdge, title: 'An Edge' };
        expect(isEmpty(noneEmpty)).toBe(false);
      });
    });

    describe('actions', () => {
      it('should create an action to update the edge type', () => {
        const type = EdgeType.BIDIRECTED;
        const expected = {
          type: types.EDGE_TYPE,
          payload: { edgeType: type },
        };
        expect(edgeType(type)).toEqual(expected);
      });

      it('should create an action to update the edge title', () => {
        const title = 'id';
        const expected = {
          type: types.EDGE_TITLE,
          payload: { title },
        };
        expect(edgeTitle(title)).toEqual(expected);
      });

      it('should create an action to update edge tags', () => {
        const tags = 'morphism';
        const expected = {
          type: types.EDGE_TAGS,
          payload: { tags },
        };
        expect(edgeTags(tags)).toEqual(expected);
      });

      it('should create an action to update the edge summary', () => {
        const summary = 'My domain is also my codomain.';
        const expected = {
          type: types.EDGE_SUMMARY,
          payload: { summary },
        };
        expect(edgeSummary(summary)).toEqual(expected);
      });
    });
  });
});