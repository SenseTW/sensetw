import * as nock from 'nock';
import { nockedAPI } from './client.test';
import { endpoint } from './client';
import {
  addCardToBox,
  removeCardFromBox,
  deleteObjectsByCard,
  deleteObjectsByBox,
} from './index';
import { AnchorType } from '../../graphics/drawing';
import { ObjectType, ObjectData } from '../sense/object';
import { GraphQLObjectFields } from './object';
import { GraphQLCardFields } from './card';
import { GraphQLBoxFields } from './box';
import { anonymousUser } from '../session';

const cardId = '500fc786-f82e-40ce-ab67-8f61067c8b1d';

const card: GraphQLCardFields = {
  id: cardId,
  createdAt: '2018-10-09T03:31:49.637Z',
  updatedAt: '2018-10-09T03:31:49.637Z',
  title: '欲速則不達，得有效率練 - 該如何在爵士合奏時，不會因為一心多用就掉Form？',
  summary: '',
  quote: '不講大道理之練習建議',
  description: '',
  tags: '',
  saidBy: '',
  stakeholder: '',
  url: 'http://www.chipinkaiyajazz.com/2016/05/form.html',
  cardType: 'INFO',
  objects: [{ id: 'd21493d8-1bc1-4743-8f51-a2473d10a560' }],
  map: { id: 'ab02dbb5-700a-4a87-967f-e51f6fa03c2e' },
  owner: null,
};

const cardObjectId = 'd21493d8-1bc1-4743-8f51-a2473d10a560';

const boxId = 'd4079522-665e-462b-9b9b-9cf5cb83fb76';

const boxObjectId = 'c3e63201-7f82-4aa5-a1a0-12e8058bc4b1';

const rawCardObject: GraphQLObjectFields = {
  id: cardObjectId,
  createdAt: '2018-10-09T03:33:47.160Z',
  updatedAt: '2018-10-09T03:33:47.160Z',
  x: 266,
  y: 386,
  width: 0,
  height: 0,
  zIndex: 0,
  objectType: 'NONE',
};

const cardObject: ObjectData = {
  id: cardObjectId,
  createdAt: 1539056027160,
  updatedAt: 1539056027160,
  anchor: AnchorType.CENTER,
  x: 266,
  y: 386,
  width: 0,
  height: 0,
  zIndex: 0,
  // the deleted object should not hold any kind of things
  objectType: ObjectType.NONE,
  data: '',
  belongsTo: undefined,
};

const box: GraphQLBoxFields = {
  id: boxId,
  createdAt: '2018-09-12T18:26:37.127Z',
  updatedAt: '2018-09-12T18:26:37.127Z',
  title: 'Font',
  summary: '',
  tags: '',
  boxType: 'NOTE',
  objects: [{ id: 'c3e63201-7f82-4aa5-a1a0-12e8058bc4b1' }],
  map: { id: 'ab02dbb5-700a-4a87-967f-e51f6fa03c2e' },
  contains: [],
  owner: null,
};

const rawBoxObject: GraphQLObjectFields = {
  id: boxObjectId,
  createdAt: '2018-09-12T18:26:37.223Z',
  updatedAt: '2018-09-12T18:26:37.223Z',
  x: 1064,
  y: 578,
  width: 0,
  height: 0,
  zIndex: 0,
  objectType: 'NONE',
};

const boxObject: ObjectData = {
  id: boxObjectId,
  createdAt: 1536776797223,
  updatedAt: 1536776797223,
  anchor: AnchorType.CENTER,
  x: 1064,
  y: 578,
  width: 0,
  height: 0,
  zIndex: 0,
  objectType: ObjectType.NONE,
  data: '',
  belongsTo: undefined,
};

describe('GraphQL API', () => {
  beforeAll(() => nock.disableNetConnect());
  afterAll(() => nock.enableNetConnect());

  afterEach(() => nock.cleanAll());

  describe('Interaction', () => {
    describe('addCardToBox', () => {
      it('should add a card object to a box', async () => {
        nockedAPI.reply(
          200,
          {
            data: {
              addToContainCards: {
                belongsToBox: { id: boxId },
                containsObject: { id: cardObjectId },
              }
            }
          }
        );
        // we are not using the result for now
        const result = await addCardToBox(anonymousUser, cardObjectId, boxId);
        expect(result).toBeDefined();
      });
    });

    describe('removeCardFromBox', () => {
      it('should remove a card object from a box', async () => {
        nockedAPI.reply(
          200,
          {
            data: {
              removeFromContainCards: {
                belongsToBox: { id: boxId },
                containsObject: { id: cardObjectId },
              }
            }
          }
        );
        // we are not using the result for now
        const result = await removeCardFromBox(anonymousUser, cardObjectId, boxId);
        expect(result).toBeDefined();
      });
    });

    describe('deleteObjectsByCard', () => {
      it('should delete objects that hold the target card', async () => {
        nock(endpoint)
          .defaultReplyHeaders({ 'Content-Type': 'application/json' })
          .post('', /Card/)
          .reply(200, { data: { Card: card } })
          .post('', /deleteObject/)
          .reply(200, { data: { deleteObject: rawCardObject }});
        const result = await deleteObjectsByCard(anonymousUser, cardId);
        expect(result).toEqual([cardObject]);
      });
    });

    describe('deleteObjectsByBox', () => {
      it('should delete objects that hold the target box', async () => {
        nock(endpoint)
          .defaultReplyHeaders({ 'Content-Type': 'application/json' })
          .post('', /Box/)
          .reply(200, { data: { Box: box } })
          .post('', /deleteObject/)
          .reply(200, { data: { deleteObject: rawBoxObject }});
        const result = await deleteObjectsByBox(anonymousUser, boxId);
        expect(result).toEqual([boxObject]);
      });
    });
  });
});