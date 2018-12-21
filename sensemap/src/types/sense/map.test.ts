import {
  MapType,
  emptyMapData,
  isEmpty,
  mapData,
  types,
  updateType,
  updateName,
  updateDescription,
  updateTags,
  updateImage,
} from './map';

describe('types', () => {
  describe('Map', () => {
    describe('functions', () => {
      it('should be able to check if a map is empty or not', () => {
        expect(isEmpty({ ...emptyMapData })).toBe(true);
        expect(isEmpty({ ...emptyMapData, id: '1' })).toBe(false);
        expect(isEmpty(mapData())).toBe(false);
      });
    });

    describe('actions', () => {
      it('should create an action to update the map type', () => {
        const type = MapType.PUBLIC;
        const expceted = {
          type: types.UPDATE_MAP_TYPE,
          payload: { type },
        };
        expect(updateType(type)).toEqual(expceted);
      });

      it('should create an action to update the map name', () => {
        const name = 'Da Shago Kallai';
        const expceted = {
          type: types.UPDATE_MAP_NAME,
          payload: { name },
        };
        expect(updateName(name)).toEqual(expceted);
      });

      it('should create an action to update the map description', () => {
        const description = 'a settlement in Northern Kabul';
        const expceted = {
          type: types.UPDATE_MAP_DESCRIPTION,
          payload: { description },
        };
        expect(updateDescription(description)).toEqual(expceted);
      });

      it('should create an action to update map tags', () => {
        const tags = 'Afghanistan';
        const expceted = {
          type: types.UPDATE_MAP_TAGS,
          payload: { tags },
        };
        expect(updateTags(tags)).toEqual(expceted);
      });

      it('should create an action to update the map image', () => {
        const image = 'http://example.com/';
        const expceted = {
          type: types.UPDATE_MAP_IMAGE,
          payload: { image },
        };
        expect(updateImage(image)).toEqual(expceted);
      });
    });
  });
});