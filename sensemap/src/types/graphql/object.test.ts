import * as nock from 'nock';
import { nockedAPI } from './client.test';
import {
  loadRawObjects,
  loadObjects,
  loadObjectsById,
  create,
  move,
  updateObjectType,
  remove,
} from './object';
import { AnchorType } from '../../graphics/drawing';
import { GraphQLObjectFields } from './object';
import { ObjectType, ObjectData } from '../sense/object';
import { anonymousUser } from '../session';

const mapId = '94aa8a0d-7013-4fcb-b850-c1e29d7c1c76';

const rawObject: GraphQLObjectFields = {
  id: 'c3e63201-7f82-4aa5-a1a0-12e8058bc4b1',
  createdAt: '2018-09-12T18:26:37.223Z',
  updatedAt: '2018-09-12T18:26:37.223Z',
  x: 1064,
  y: 578,
  width: 0,
  height: 0,
  zIndex: 0,
  objectType: 'BOX',
  box: { id: 'd4079522-665e-462b-9b9b-9cf5cb83fb76' },
};

const object: ObjectData = {
  id: 'c3e63201-7f82-4aa5-a1a0-12e8058bc4b1',
  createdAt: 1536776797223,
  updatedAt: 1536776797223,
  anchor: AnchorType.CENTER,
  x: 1064,
  y: 578,
  // width and height are patched to match the design
  width: 320,
  height: 130,
  zIndex: 0,
  objectType: ObjectType.BOX,
  data: 'd4079522-665e-462b-9b9b-9cf5cb83fb76',
  belongsTo: undefined,
};

describe('GraphQL API', () => {
  beforeAll(() => nock.disableNetConnect());
  afterAll(() => nock.enableNetConnect());

  afterEach(() => nock.cleanAll());

  describe('Object', () => {
    describe('loadRawObjects', () => {
      it('should load raw objects from a map', async () => {
        nockedAPI.reply(200, { data: { allObjects: [rawObject] } });
        const result = await loadRawObjects(anonymousUser, mapId);
        expect(result).toEqual([rawObject]);
      });
    });

    describe('loadObjects', () => {
      it('should load objects from a map', async () => {
        nockedAPI.reply(200, { data: { allObjects: [rawObject] } });
        const result = await loadObjects(anonymousUser, mapId);
        expect(result).toEqual([object]);
      });
    });

    describe('loadObjectsById', () => {
      it('should load objects by their ids', async () => {
        nockedAPI.reply(200, { data: { object_0: rawObject }});
        const result = await loadObjectsById(anonymousUser, [object.id]);
        expect(result).toEqual([object]);
      });
    });

    describe('create', () => {
      it('should create a new object', async () => {
        nockedAPI.reply(200, { data: { createObject: rawObject } });
        const result = await create(anonymousUser, mapId, object);
        expect(result).toEqual(object);
      });
    });

    describe('move', () => {
      it('should move an object', async () => {
        nockedAPI.reply(200, { data: { updateObject: rawObject } });
        const result = await move(anonymousUser, object.id, 1064, 578);
        expect(result).toEqual(object);
      });
    });

    describe('updateObjectType', () => {
      it('should update the object type', async () => {
        nockedAPI.reply(200, { data: { updateObject: rawObject } });
        const result = await updateObjectType(anonymousUser, object.id, ObjectType.BOX);
        expect(result).toEqual(object);
      });
    });

    describe('remove', () => {
      it('should remove an object', async () => {
        nockedAPI.reply(200, { data: { deleteObject: rawObject } });
        const result = await remove(anonymousUser, object.id);
        expect(result).toEqual({
          ...object,
          objectType: ObjectType.NONE,
          data: '',
          width: 0,
          height: 0
        });
      });
    });
  });
});