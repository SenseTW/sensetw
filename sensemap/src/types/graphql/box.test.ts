import * as nock from 'nock';
import { nockedAPI } from './client.test';
import { GraphQLBoxFields, loadBoxes } from './box';
import { BoxType, BoxData } from '../sense/box';
import { anonymousUserData } from '../sense/user';
import { anonymousUser } from '../session';

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

describe('GraphQL API', () => {
  beforeAll(() => nock.disableNetConnect());
  afterAll(() => nock.enableNetConnect());

  afterEach(() => nock.cleanAll());

  describe('Box', () => {
    describe('loadBoxes', () => {
      it('should load boxes from the backend', async () => {
        nockedAPI.reply(200, { data: { allBoxes: [rawBox0, rawBox1] } });
        const boxes = await loadBoxes(anonymousUser, '94aa8a0d-7013-4fcb-b850-c1e29d7c1c76');
        expect(boxes).toEqual([box0, box1]);
      });
    });
  });
});