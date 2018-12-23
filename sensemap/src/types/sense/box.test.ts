import * as Box from './box';

describe('types', () => {
  describe('Box', () => {
    describe('functions', () => {
      describe('toBoxType', () => {
        it('should parse a unknown string to the default box type: INFO', () => {
          expect(Box.toBoxType('foobar')).toBe(Box.BoxType.INFO);
        });
      });
    });

    describe('actions', () => {
      it('should create an action to update the box title', () => {
        const title = 'MEGALO BOX';
        const expectedAction = {
          type: Box.types.UPDATE_BOX_TITLE,
          payload: { title },
        };

        expect(Box.actions.updateTitle(title)).toEqual(expectedAction);
      });

      it('should create an action to update the box summary', () => {
        const summary = 'GEARLESS JOE';
        const expectedAction = {
          type: Box.types.UPDATE_BOX_SUMMARY,
          payload: { summary },
        };

        expect(Box.actions.updateSummary(summary)).toEqual(expectedAction);
      });

      it('should create an action to update the box tags', () => {
        const tags = 'Ashita, no, Joe';
        const expectedAction = {
          type: Box.types.UPDATE_BOX_TAGS,
          payload: { tags },
        };

        expect(Box.actions.updateTags(tags)).toEqual(expectedAction);
      });
    });

    describe('reducer', () => {
      it('should return the initial state', () => {
        expect(Box.reducer()).toEqual(Box.emptyBoxData);
      });

      it('should update the box title', () => {
        const title = 'MEGALO BOX';
        expect(Box.reducer(Box.emptyBoxData, Box.updateTitle(title)))
          .toEqual({ ...Box.emptyBoxData, title });
      });

      it('should update the box title', () => {
        const summary = 'JUNKDOG';
        expect(Box.reducer(Box.emptyBoxData, Box.updateSummary(summary)))
          .toEqual({ ...Box.emptyBoxData, summary });
      });

      it('should update the box title', () => {
        const tags = 'Hajime, no, Ippo';
        expect(Box.reducer(Box.emptyBoxData, Box.updateTags(tags))).toEqual({ ...Box.emptyBoxData, tags });
      });
    });
  });
});