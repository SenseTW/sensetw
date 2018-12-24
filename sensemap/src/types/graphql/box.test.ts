import * as nock from 'nock';
import { nockedAPI } from './client.test';
import {
  GraphQLBoxFields,
  loadBoxes,
  loadBoxesById,
  loadBoxIds,
  create,
  update,
  remove,
} from './box';
import { BoxType, BoxData } from '../sense/box';
import { anonymousUserData } from '../sense/user';
import { anonymousUser } from '../session';

const mapId = '94aa8a0d-7013-4fcb-b850-c1e29d7c1c76';

const rawBox0: GraphQLBoxFields = {
  id: '95d97aa6-bf02-4778-8bff-26c9ffe3d396',
  createdAt: '2018-08-07T08:01:07.300Z',
  updatedAt: '2018-08-07T08:01:07.300Z',
  title: 'Annotation：一邊看資料一邊抓重點（右上）',
  summary: '',
  tags: '畫重點, 註解, 下 tag',
  boxType: 'NODE', // unknown type should be parsed to BoxType.NOTE
  objects: [{ id: '98fc5eff-ea1f-4639-b18e-187837d08973' }],
  contains: [],
  map: { id: '94aa8a0d-7013-4fcb-b850-c1e29d7c1c76' },
  owner: null,
};

const rawBox1: GraphQLBoxFields = {
  id: '2d5dc90a-210b-4892-8e7e-76abcf982ce8',
  createdAt: '2018-08-07T08:05:10.501Z',
  updatedAt: '2018-08-07T08:05:10.501Z',
  title: '我是 Box： 可以用來做標題和收納多張卡片',
  summary: '',
  tags: '',
  boxType: 'NOTE',
  objects: [{ id: '3dcd2927-999d-46a4-90c8-1cc1e59c414d' }],
  contains: [],
  map: { id: '94aa8a0d-7013-4fcb-b850-c1e29d7c1c76' },
  owner: null,
};

const rawBox2: GraphQLBoxFields = {
  id: 'a5fab479-e9bd-4302-b26a-fec90ab6482f',
  createdAt: '2018-12-24T03:58:43.446Z',
  updatedAt: '2018-12-24T03:58:43.446Z',
  title: '小盒子',
  summary: '一個盒子',
  tags: '盒子, sense',
  boxType: 'DEFINITION',
  objects: [{ id: '57d7aa93-971f-4a42-a9f2-04153c47cb6f' }],
  contains: [],
  map: { id: '94aa8a0d-7013-4fcb-b850-c1e29d7c1c76' },
  owner: null,
};

const box0: BoxData = {
  id: '95d97aa6-bf02-4778-8bff-26c9ffe3d396',
  createdAt: 1533628867300,
  updatedAt: 1533628867300,
  title: 'Annotation：一邊看資料一邊抓重點（右上）',
  summary: '',
  tags: '畫重點, 註解, 下 tag',
  boxType: BoxType.INFO,
  objects: {
    '98fc5eff-ea1f-4639-b18e-187837d08973': { id: '98fc5eff-ea1f-4639-b18e-187837d08973' },
  },
  contains: {},
  owner: anonymousUserData,
};

const box1: BoxData = {
  id: '2d5dc90a-210b-4892-8e7e-76abcf982ce8',
  createdAt: 1533629110501,
  updatedAt: 1533629110501,
  title: '我是 Box： 可以用來做標題和收納多張卡片',
  summary: '',
  tags: '',
  boxType: BoxType.NOTE,
  objects: {
    '3dcd2927-999d-46a4-90c8-1cc1e59c414d': { id: '3dcd2927-999d-46a4-90c8-1cc1e59c414d' },
  },
  contains: {},
  owner: anonymousUserData,
};

const newBox2: BoxData = {
  id: '0',
  createdAt: 1545623921446,
  updatedAt: 1545623921446,
  title: '小盒子',
  summary: '一個盒子',
  tags: '盒子, sense',
  boxType: BoxType.DEFINITION,
  objects: {
    '57d7aa93-971f-4a42-a9f2-04153c47cb6f': { id: '57d7aa93-971f-4a42-a9f2-04153c47cb6f' },
  },
  contains: {},
  owner: anonymousUserData,
};

const box2: BoxData = {
  id: 'a5fab479-e9bd-4302-b26a-fec90ab6482f',
  createdAt: 1545623923446,
  updatedAt: 1545623923446,
  title: '小盒子',
  summary: '一個盒子',
  tags: '盒子, sense',
  boxType: BoxType.DEFINITION,
  objects: {
    '57d7aa93-971f-4a42-a9f2-04153c47cb6f': { id: '57d7aa93-971f-4a42-a9f2-04153c47cb6f' },
  },
  contains: {},
  owner: anonymousUserData,
};

describe('GraphQL API', () => {
  beforeAll(() => nock.disableNetConnect());
  afterAll(() => nock.enableNetConnect());

  afterEach(() => nock.cleanAll());

  describe('Box', () => {
    describe('loadBoxes', () => {
      it('should load boxes from the backend', async () => {
        nockedAPI.reply(200, { data: { allBoxes: [rawBox0, rawBox1] } });
        const boxes = await loadBoxes(anonymousUser, mapId);
        expect(boxes).toEqual([box0, box1]);
      });
    });

    describe('loadBoxesById', () => {
      it('should load boxes by their ids', async () => {
        nockedAPI.reply(200, { data: { box_0: rawBox0, box_1: rawBox1 }});
        const boxes = await loadBoxesById(
          anonymousUser,
          ['95d97aa6-bf02-4778-8bff-26c9ffe3d396', '2d5dc90a-210b-4892-8e7e-76abcf982ce8']
        );
        expect(boxes).toEqual([box0, box1]);
      });
    });

    describe('loadBoxIds', () => {
      it('should load boxes ids from a map', async () => {
        nockedAPI.reply(
          200,
          {
            data: {
              allBoxes: [
                { id: '95d97aa6-bf02-4778-8bff-26c9ffe3d396' },
                { id: '2d5dc90a-210b-4892-8e7e-76abcf982ce8' },
              ]
            }
          }
        );
        const ids = await loadBoxIds(anonymousUser, mapId);
        expect(ids).toEqual([box0.id, box1.id]);
      });
    });

    describe('create', () => {
      it('should create a box from a partial box data', async () => {
        nockedAPI.reply(200, { data: { createBox: rawBox2 } });
        const box = await create(anonymousUser, mapId, newBox2);
        expect(box).toEqual(box2);
      });
    });

    describe('update', () => {
      it('should update a box', async () => {
        nockedAPI.reply(200, { data: { updateBox: rawBox2 } });
        const box = await update(anonymousUser, box2);
        expect(box).toEqual(box2);
      });
    });

    describe('delete', () => {
      it('should delete a box by its id', async () => {
        nockedAPI.reply(200, { data: { deleteBox: rawBox2 } });
        const box = await remove(anonymousUser, box2.id);
        expect(box).toEqual(box2);
      });
    });
  });
});