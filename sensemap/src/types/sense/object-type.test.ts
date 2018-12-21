import {
  ObjectType,
  fromString,
} from './object-type';

describe('types', () => {
  describe('ObjectType', () => {
    describe('fromString', () => {
      it('should convert a string to a object type', () => {
        expect(fromString('NONE')).toBe(ObjectType.NONE);
        expect(fromString('BOX')).toBe(ObjectType.BOX);
        expect(fromString('CARD')).toBe(ObjectType.CARD);
        expect(fromString('')).toBe(ObjectType.NONE);
      });
    });
  });
});