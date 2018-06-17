import * as Box from './box';

describe('types', () => {
  describe('Box', () => {
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
  });
});