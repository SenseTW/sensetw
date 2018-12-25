import * as nock from 'nock';
import { nockedAPI } from './client.test';
import {
  GraphQLEdgeFields,
  load,
  loadById,
  loadIds,
  create,
  update,
  remove,
} from './edge';
import { EdgeType, Edge } from '../sense/edge';
import { anonymousUser } from '../session';

const mapId = '94aa8a0d-7013-4fcb-b850-c1e29d7c1c76';

const rawEdge0: GraphQLEdgeFields = {
  id: '5c3e536f-f8e5-4eac-a0ec-177d8ff07d38',
  map: { id: '94aa8a0d-7013-4fcb-b850-c1e29d7c1c76' },
  from: { id: 'a701a04a-cae2-4c06-b156-3df36b2d3694' },
  to: { id: 'f09305e8-f4d8-4fd5-bc1e-2128413deac2' },
  edgeType: 'NONE',
  title: '',
  tags: '',
  summary: '',
};

const rawEdge1: GraphQLEdgeFields = {
  id: '6e3ab337-18f7-46b7-8a65-8a744f17bbc6',
  map: { id: '94aa8a0d-7013-4fcb-b850-c1e29d7c1c76' },
  from: { id: '3dcd2927-999d-46a4-90c8-1cc1e59c414d' },
  to: { id: 'a701a04a-cae2-4c06-b156-3df36b2d3694' },
  edgeType: 'FOOBAR',
  title: '',
  tags: '',
  summary: '',
};

const edge0: Edge = {
  id: '5c3e536f-f8e5-4eac-a0ec-177d8ff07d38',
  map: '94aa8a0d-7013-4fcb-b850-c1e29d7c1c76',
  from: 'a701a04a-cae2-4c06-b156-3df36b2d3694',
  to: 'f09305e8-f4d8-4fd5-bc1e-2128413deac2',
  edgeType: EdgeType.NONE,
  title: '',
  tags: '',
  summary: '',
};

const edge1: Edge = {
  id: '6e3ab337-18f7-46b7-8a65-8a744f17bbc6',
  map: '94aa8a0d-7013-4fcb-b850-c1e29d7c1c76',
  from: '3dcd2927-999d-46a4-90c8-1cc1e59c414d',
  to: 'a701a04a-cae2-4c06-b156-3df36b2d3694',
  edgeType: EdgeType.NONE,
  title: '',
  tags: '',
  summary: '',
};

describe('GraphQL API', () => {
  beforeAll(() => nock.disableNetConnect());
  afterAll(() => nock.enableNetConnect());

  beforeEach(() => nock.cleanAll());

  describe('Edge', () => {
    describe('load', () => {
      it('should load edges from a map', async () => {
        nockedAPI.reply(200, { data: { allEdges: [rawEdge0, rawEdge1] } });
        const edges = await load(anonymousUser, mapId);
        expect(edges).toEqual([edge0, edge1]);
      });
    });

    describe('loadById', () => {
      it('should load edges by their ids', async () => {
        nockedAPI.reply(200, { data: { edge_0: rawEdge0, edge_1: rawEdge1 }});
        const edges = await loadById(
          anonymousUser,
          [
            '5c3e536f-f8e5-4eac-a0ec-177d8ff07d38',
            '6e3ab337-18f7-46b7-8a65-8a744f17bbc6',
          ]
        );
        expect(edges).toEqual([edge0, edge1]);
      });
    });

    describe('loadIds', () => {
      it('should load edge ids from a map', async () => {
        nockedAPI.reply(200, { data: { allEdges: [{ id: rawEdge0.id }, { id: rawEdge1.id }] } });
        const ids = await loadIds(anonymousUser, mapId);
        expect(ids).toEqual([edge0.id, edge1.id]);
      });
    });

    describe('create', () => {
      it('should create an edge', async () => {
        nockedAPI.reply(200, { data: { createEdge: rawEdge0 } });
        const edge = await create(anonymousUser, mapId, edge0.from, edge0.to);
        expect(edge).toEqual(edge0);
      });
    });

    describe('update', () => {
      it('should update an edge', async () => {
        nockedAPI.reply(200, { data: { updateEdge: rawEdge0 } });
        const edge = await update(edge0);
        expect(edge).toEqual(edge0);
      });
    });

    describe('remove', () => {
      it('should remove an edge', async () => {
        nockedAPI.reply(200, { data: { deleteEdge: rawEdge0 }});
        const edge = await remove(anonymousUser, edge0.id);
        expect(edge).toEqual(edge0);
      });
    });
  });
});