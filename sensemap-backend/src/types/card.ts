import { gql } from "apollo-server";
import {
  ID,
  Card,
  cardsQuery,
  cardDataFields,
  cardWithTargetFields,
  SenseObject,
  objectsQuery
} from "./sql";
import { CardType } from "./primitive";
import { MapFilter } from "./map";
import * as R from "ramda";
import * as A from "./oauth";
import * as T from "./transaction";

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
  orderBy?: string | [string, string];
  skip?: number;
  limit?: number;
  //after?: string;
  //before?: string;
  //first?: number;
  //last?: number;
};

const writableFields = R.filter(name => name !== "quote", cardDataFields);

export function cardsWithTargetQuery(db) {
  return db.select(cardWithTargetFields).from("card");
}

export async function getCard(db, id: ID): Promise<Card | null> {
  const c = await cardsQuery(db)
    .where("id", id)
    .first();
  return !!c ? c : null;
}

export async function getAllCards(
  db,
  args: AllCardsArgs = {},
  query = cardsQuery
): Promise<Card[]> {
  let q = query(db);
  if (args.filter) {
    const { map, tags, url } = args.filter;
    if (map) {
      q = q.andWhere("mapId", map.id);
    }
    if (tags) {
      q = q.andWhereRaw('"tags" @@ ?', tags);
    }
    if (url) {
      q = q.andWhere("url", url);
    }
  }

  if (args.limit) {
    q = q.limit(args.limit);
  }
  if (args.skip) {
    q = q.offset(args.skip);
  }
  if (typeof args.orderBy === "string") {
    q = q.orderBy(args.orderBy, "desc");
  } else if (args.orderBy) {
    q = q.orderBy(args.orderBy[0], args.orderBy[1]);
  }
  return q;
}

async function getObjectsForCard(db, id: ID): Promise<SenseObject[]> {
  return objectsQuery(db).where("cardId", id);
}

export const typeDefs = [
  gql`
    input CardFilter {
      id: ID
      map: MapFilter
      url: String
      tags: String
    }

    input CardIDFilter {
      id: ID!
    }

    extend type Query {
      allCards(filter: CardFilter): [Card!]!
      Card(id: ID): Card
    }

    extend type Mutation {
      createCard(
        cardType: CardType
        description: String
        saidBy: String
        stakeholder: String
        summary: String
        quote: String
        tags: String
        title: String
        url: String
        mapId: ID
        objectsIds: [ID!]
      ): Card
      updateCard(
        id: ID!
        cardType: CardType
        description: String
        saidBy: String
        stakeholder: String
        summary: String
        quote: String
        tags: String
        title: String
        url: String
        mapId: ID
        objectsIds: [ID!]
      ): Card
      deleteCard(id: ID!): Card
    }

    enum CardType {
      NOTE
      PROBLEM
      SOLUTION
      DEFINITION
      INFO
    }

    type Card @model {
      id: ID! @isUnique
      createdAt: DateTime!
      updatedAt: DateTime!
      title: String
      summary: String
      quote: String
      description: String
      tags: String
      saidBy: String
      stakeholder: String
      url: String
      cardType: CardType @migrationValue(value: INFO)
      objects: [Object!]! @relation(name: "ObjectCard")
      mapId: ID
      map: Map @relation(name: "MapCards")
      owner: User
    }
  `
];

type CardParent = ID | Card;

export const resolvers = {
  Query: {
    allCards: async (_, args: AllCardsArgs, { db }, info): Promise<Card[]> => {
      if (args.filter) {
        return getAllCards(db, args);
      } else {
        return getAllCards(db);
      }
    },

    Card: async (_, { id }, { db }, info): Promise<Card | null> => {
      return getCard(db, id);
    }
  },
  Mutation: {
    createCard: async (
      _,
      args,
      { db, user, authorization },
      info
    ): Promise<Card> => {
      const u = user
        ? user
        : await A.getUserFromAuthorization(db, authorization);
      args.ownerId = !!u ? u.id : null;
      const trx = T.createCard(R.pick(writableFields, args));
      const r = await T.run(db, u, trx);
      return r.payload.data;
    },

    deleteCard: async (
      _,
      { id },
      { db, user, authorization },
      info
    ): Promise<Card> => {
      const u = user
        ? user
        : await A.getUserFromAuthorization(db, authorization);
      const trx = T.deleteCard(id);
      const r = await T.run(db, u, trx);
      return r.payload.data;
    },

    updateCard: async (
      _,
      args,
      { db, user, authorization },
      info
    ): Promise<Card> => {
      const u = user
        ? user
        : await A.getUserFromAuthorization(db, authorization);
      const trx = T.updateCard(args.id, R.pick(writableFields, args));
      const r = await T.run(db, u, trx);
      return r.payload.data;
    }
  },
  Card: {
    id: async (o: CardParent): Promise<ID> =>
      typeof o !== "string" ? o.id : o,
    createdAt: async (o: CardParent, {}, { db }): Promise<Date> =>
      typeof o !== "string" ? o.createdAt : (await getCard(db, o)).createdAt,
    updatedAt: async (o: CardParent, {}, { db }): Promise<Date> =>
      typeof o !== "string" ? o.updatedAt : (await getCard(db, o)).updatedAt,
    cardType: async (o: CardParent, {}, { db }): Promise<CardType> =>
      typeof o !== "string" ? o.cardType : (await getCard(db, o)).cardType,
    description: async (o: CardParent, {}, { db }): Promise<string> =>
      typeof o !== "string"
        ? o.description
        : (await getCard(db, o)).description,
    saidBy: async (o: CardParent, {}, { db }): Promise<string> =>
      typeof o !== "string" ? o.saidBy : (await getCard(db, o)).saidBy,
    stakeholder: async (o: CardParent, {}, { db }): Promise<string> =>
      typeof o !== "string"
        ? o.stakeholder
        : (await getCard(db, o)).stakeholder,
    summary: async (o: CardParent, {}, { db }): Promise<string> =>
      typeof o !== "string" ? o.summary : (await getCard(db, o)).summary,
    quote: async (o: CardParent, {}, { db }): Promise<string> =>
      typeof o !== "string" ? o.quote : (await getCard(db, o)).quote,
    tags: async (o: CardParent, {}, { db }): Promise<string> =>
      typeof o !== "string" ? o.tags : (await getCard(db, o)).tags,
    title: async (o: CardParent, {}, { db }): Promise<string> =>
      typeof o !== "string" ? o.title : (await getCard(db, o)).title,
    url: async (o: CardParent, {}, { db }): Promise<string> =>
      typeof o !== "string" ? o.url : (await getCard(db, o)).url,
    mapId: async (o: CardParent, {}, { db }): Promise<ID> =>
      typeof o !== "string" ? o.mapId : (await getCard(db, o)).mapId,
    map: async (o: CardParent, {}, { db }): Promise<ID> =>
      typeof o !== "string" ? o.mapId : (await getCard(db, o)).mapId,
    objects: async (o: CardParent, {}, { db }): Promise<SenseObject[]> =>
      typeof o !== "string" ? getObjectsForCard(db, o.id) : getObjectsForCard(db, o),
    owner: async (o: CardParent, {}, { db }): Promise<ID> =>
      typeof o !== "string" ? o.ownerId : (await getCard(db, o)).ownerId
  }
};
