import {
  objectData,
  types,
  updatePosition,
  updateDimension,
} from './object';

describe('types', () => {
  describe('Object', () => {
    describe('functions', () => {
      it('should create a new sense object data', () => {
          expect(objectData).toBeDefined();
      });
    });

    describe('actions' , () => {
      it('should create an action to update the object position', () => {
        const x = 10;
        const y = 20;
        const expected = {
          type: types.UPDATE_POSITION,
          payload: { x, y },
        };
        expect(updatePosition(x, y)).toEqual(expected);
      });

      it('should create an action to update the object dimension', () => {
        const width = 640;
        const height = 480;
        const expected = {
          type: types.UPDATE_DIMENSION,
          payload: { width, height },
        };
        expect(updateDimension(width, height)).toEqual(expected);
      });
    });
  });
});