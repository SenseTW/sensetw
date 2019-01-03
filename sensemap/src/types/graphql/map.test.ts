import * as nock from 'nock';
import { nockedAPI } from './client.test';
import {
  GraphQLMapFields,
  loadMaps,
  create,
  update,
  remove,
} from './map';
import { MapType, MapData } from '../sense/map';
import { anonymousUserData } from '../sense/user';
import { anonymousUser } from '../session';

const rawMap: GraphQLMapFields = {
  id: '94aa8a0d-7013-4fcb-b850-c1e29d7c1c76',
  type: 'PUBLIC',
  createdAt: '2018-08-07T07:59:11.918Z',
  updatedAt: '2018-12-06T00:35:10.726Z',
  name: '㊙️怎麼用 sense.tw㊙️',
  description: '圖解 sense.tw 功能區塊。↵操作手冊：https://help.sense.tw/',
  tags: '新手看這邊',
  image: '',
  owner: null,
};

const map: MapData = {
  id: '94aa8a0d-7013-4fcb-b850-c1e29d7c1c76',
  type: MapType.PUBLIC,
  createdAt: 1533628751918,
  updatedAt: 1544056510726,
  name: '㊙️怎麼用 sense.tw㊙️',
  description: '圖解 sense.tw 功能區塊。↵操作手冊：https://help.sense.tw/',
  tags: '新手看這邊',
  image: '',
  owner: anonymousUserData,
};

describe('GraphQL API', () => {
  beforeAll(() => nock.disableNetConnect());
  afterAll(() => nock.enableNetConnect());

  afterEach(() => nock.cleanAll());

  describe('Map', () => {
    describe('loadMaps', () => {
      it('should load maps', async () => {
        nockedAPI.reply(200, { data: { allMaps: [rawMap] } });
        const result = await loadMaps(anonymousUser);
        expect(result).toEqual([map]);
      });
    });
  });

  describe('create', () => {
    it('should create a new map', async () => {
      nockedAPI.reply(200, { data: { createMap: rawMap } });
      const result = await create(anonymousUser, map);
      expect(result).toEqual(map);
    });
  });

  describe('update', () => {
    it('should update a map', async () => {
      nockedAPI.reply(200, { data: { updateMap: rawMap } });
      const result = await update(anonymousUser, map);
      expect(result).toEqual(map);
    });
  });

  describe('remove', () => {
    it('should remove a map', async () => {
      nockedAPI.reply(200, { data: { deleteMap: rawMap } });
      const result = await remove(anonymousUser, map.id);
      expect(result).toEqual(map);
    });
  });
});