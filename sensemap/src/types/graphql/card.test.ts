import * as nock from 'nock';
import { nockedAPI } from './client.test';
import {
  GraphQLCardFields,
  loadCards,
  loadCardsById,
  loadCardIds,
  create,
  update,
  remove,
} from './card';
import { CardType, CardData } from '../sense/card';
import { anonymousUserData } from '../sense/user';
import { anonymousUser } from '../session';

const mapId = '94aa8a0d-7013-4fcb-b850-c1e29d7c1c76';

const rawCard0: GraphQLCardFields = {
  id: '6f2e3eb3-42ba-40fd-b3b7-eb204afccb89',
  createdAt: '2018-12-20T12:01:42.122Z',
  updatedAt: '2018-12-20T12:01:42.122Z',
  title: 'New Card',
  summary: '簽到區：↵投影機左邊：↵- 企鵝↵- 蕃茄↵- 土潑鼠↵- 甲汁甲↵- 草汁↵↵投影機右邊：↵- 宏宏↵- 俊俊↵- Allen Chou↵- 柏安↵- Paul',
  quote: '',
  description: '',
  tags: '',
  saidBy: '',
  stakeholder: '',
  url: '',
  cardType: 'INFO',
  objects: [{ id: '96d221e9-b796-4b6e-ac90-48195e9492a1' }],
  map: { id: '1c2220b6-75b1-40dc-816d-13d57d0ddfb3' },
  owner: null,
};

const rawCard1: GraphQLCardFields = {
  id: 'af2a3950-fb3e-445c-8b94-731cf125e991',
  createdAt: '2018-12-20T12:25:32.954Z',
  updatedAt: '2018-12-20T12:25:32.954Z',
  title: 'New Card',
  summary: '學會組電腦 and 基本維修',
  quote: '',
  description: '',
  tags: '',
  saidBy: '',
  stakeholder: '',
  url: '',
  cardType: 'SOLUTION',
  objects: [{ id: '72d7c4bf-351c-495a-b6a6-8dc688c7810c' }],
  map: { id: '1c2220b6-75b1-40dc-816d-13d57d0ddfb3' },
  owner: null,
};

const newCard0: CardData = {
  id: '0',
  createdAt: 0,
  updatedAt: 0,
  title: 'New Card',
  summary: '簽到區：↵投影機左邊：↵- 企鵝↵- 蕃茄↵- 土潑鼠↵- 甲汁甲↵- 草汁↵↵投影機右邊：↵- 宏宏↵- 俊俊↵- Allen Chou↵- 柏安↵- Paul',
  quote: '',
  description: '',
  tags: '',
  saidBy: '',
  stakeholder: '',
  url: '',
  cardType: CardType.INFO,
  objects: { '96d221e9-b796-4b6e-ac90-48195e9492a1': { id: '96d221e9-b796-4b6e-ac90-48195e9492a1' } },
  owner: anonymousUserData,
};

const card0: CardData = {
  id: '6f2e3eb3-42ba-40fd-b3b7-eb204afccb89',
  createdAt: 1545307302122,
  updatedAt: 1545307302122,
  title: 'New Card',
  summary: '簽到區：↵投影機左邊：↵- 企鵝↵- 蕃茄↵- 土潑鼠↵- 甲汁甲↵- 草汁↵↵投影機右邊：↵- 宏宏↵- 俊俊↵- Allen Chou↵- 柏安↵- Paul',
  quote: '',
  description: '',
  tags: '',
  saidBy: '',
  stakeholder: '',
  url: '',
  cardType: CardType.INFO,
  objects: { '96d221e9-b796-4b6e-ac90-48195e9492a1': { id: '96d221e9-b796-4b6e-ac90-48195e9492a1' } },
  owner: anonymousUserData,
};

const card1: CardData = {
  id: 'af2a3950-fb3e-445c-8b94-731cf125e991',
  createdAt: 1545308732954,
  updatedAt: 1545308732954,
  title: 'New Card',
  summary: '學會組電腦 and 基本維修',
  quote: '',
  description: '',
  tags: '',
  saidBy: '',
  stakeholder: '',
  url: '',
  cardType: CardType.SOLUTION,
  objects: { '72d7c4bf-351c-495a-b6a6-8dc688c7810c': { id: '72d7c4bf-351c-495a-b6a6-8dc688c7810c' } },
  owner: anonymousUserData,
};

describe('GraphQL API', () => {
  beforeAll(() => nock.disableNetConnect());
  afterAll(() => nock.enableNetConnect());

  afterEach(() => nock.cleanAll());

  describe('Card', () => {
    describe('loadCards', () => {
      it('should load cards from a map', async () => {
        nockedAPI.reply(200, { data: { allCards: [rawCard0, rawCard1] } });
        const cards = await loadCards(anonymousUser, mapId);
        expect(cards).toEqual([card0, card1]);
      });
    });

    describe('loadCardsById', () => {
      it('should load cards by their ids', async () => {
        nockedAPI.reply(200, { data: { card_0: rawCard0, card_1: rawCard1 } });
        const cards = await loadCardsById(
          anonymousUser,
          ['6f2e3eb3-42ba-40fd-b3b7-eb204afccb89', 'af2a3950-fb3e-445c-8b94-731cf125e991'],
        );
        expect(cards).toEqual([card0, card1]);
      });
    });

    describe('loadCardIds', () => {
      it('should load card ids from a map', async () => {
        nockedAPI.reply(
          200,
          {
            data: {
              allCards: [
                { id: '6f2e3eb3-42ba-40fd-b3b7-eb204afccb89' },
                { id: 'af2a3950-fb3e-445c-8b94-731cf125e991' },
              ]
            }
          }
        );
        const ids = await loadCardIds(anonymousUser, mapId);
        expect(ids).toEqual([card0.id, card1.id]);
      });
    });

    describe('create', () => {
      it('should create a card', async () => {
        nockedAPI.reply(200, { data: { createCard: rawCard0 } });
        const card = await create(anonymousUser, mapId, newCard0);
        expect(card).toEqual(card0);
      });
    });

    describe('update', () => {
      it('should update a card', async () => {
        nockedAPI.reply(200, { data: { updateCard: rawCard0 } });
        const card = await update(anonymousUser, card0);
        expect(card).toEqual(card0);
      });
    });

    describe('remove', () => {
      it('should remove a card by its id', async () => {
        nockedAPI.reply(200, { data: { deleteCard: rawCard0 } });
        const card = await remove(anonymousUser, card0.id);
        expect(card).toEqual(card0);
      });
    });
  });
});