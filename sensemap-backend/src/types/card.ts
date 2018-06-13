import { ID, Map, Card, CardType, cardFields, cardDataFields } from './sql';
import { getMap, getCardsInMap, MapFilter } from './map';
import { pick } from 'ramda';

export type CardFilter = {
  id?: ID;
  cardType?: CardType;
  description?: string;
  saidBy?: string;
  stakeholder?: string;
  summary?: string;
  tags?: string;
  tags_contains?: string;
  title?: string;
  url?: string;
  map?: MapFilter;

};

export type AllCardsArgs = {
  filter?: CardFilter;
  orderBy?: any;
  skip?: number;
  after: string;
  before: string;
  first: number;
  last: number;
};

export async function getCard(db, id: ID): Promise<Card | null> {
  return db.select(cardFields).from('card').where('id', id).first();
}

export async function getAllCards(db, filter: CardFilter = {}): Promise<Card[]> {
  let { map, tags, url } = filter;
  let query = db.select(cardFields).from('card');
  if (map) {
    query = query.andWhere('mapId', map.id);
  }
  if (tags) {
    query = query.andWhere('tags', tags);
  }
  if (url) {
    query = query.andWhere('url', url);
  }
  return query;
}

export async function createCard(db, args): Promise<Card> {
  const fields = pick(cardDataFields, args);
  const rows = await db('card').insert(fields).returning(cardFields);
  return rows[0];
}

export async function deleteCard(db, id: ID): Promise<Card | null> {
  const rows = await db('card').where('id', id).delete().returning(cardFields);
  return rows[0];
}

export async function updateCard(db, id: ID, args): Promise<Card | null> {
  const fields = pick(cardDataFields, args);
  const rows = await db('card').where('id', id).update(fields).returning(cardFields);
  return rows[0];
}

export const resolvers = {
  Query: {
    allCards: async (_, args: AllCardsArgs, { db }, info): Promise<Card[]> => {
      if (args.filter) {
        return getAllCards(db, args.filter);
      } else {
        return getAllCards(db);
      }
    },

    Card: async (_, { id }, { db }, info): Promise<Card | null> => {
      return getCard(db, id);
    }
  },
  Mutation: {
    createCard: async (_, args, { db }, info) => {
      return createCard(db, args);
    },

    deleteCard: async (_, { id }, { db }, info) => {
      return deleteCard(db, id);
    },

    updateCard: async (_, args, { db }, info) => {
      return updateCard(db, args.id, args);
    }
  },
  Card: {
    id:          (o, _, context, info): ID       => o.id,
    createdAt:   (o, _, context, info): Date     => o.createdAt,
    updatedAt:   (o, _, context, info): Date     => o.updatedAt,
    cardType:    (o, _, context, info): CardType => o.cardType,
    description: (o, _, context, info): string   => o.description,
    saidBy:      (o, _, context, info): string   => o.saidBy,
    stakeholder: (o, _, context, info): string   => o.stakeholder,
    summary:     (o, _, context, info): string   => o.summary,
    tags:        (o, _, context, info): string   => o.tags,
    title:       (o, _, context, info): string   => o.title,
    url:         (o, _, context, info): string   => o.url,
    mapId:       (o, _, context, info): ID       => o.mapId,

    map: async (o, _, { db }, info): Promise<Map | null> => getMap(db, o.mapId),
    // objects:
  },
};
