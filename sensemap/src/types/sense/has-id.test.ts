import {
  idOrUndefined,
  idOrError,
  toIDMap,
} from './has-id';

describe('types', () => {
  describe('has-id', () => {
    it('should get an ID or undefined', () => {
      const id = 'foobar';
      expect(idOrUndefined({ id })).toBe(id);
      expect(idOrUndefined(undefined)).toBeUndefined();
    });

    it('should get an ID or throw an error', () => {
      const errorStr = 'oops!';
      const id = 'foobar';
      expect(idOrError(errorStr, { id })).toBe(id);
      expect(() => idOrError(errorStr, undefined)).toThrow();
    });

    it('should create an ID map from an array of has-id objects', () => {
      const id1 = 'foobar';
      const id2 = 'foobaz';
      expect(toIDMap([{ id: id1 }, { id: id2 }])).toEqual({ [id1]: { id: id1 }, [id2]: { id: id2 } });
    });
  });
});