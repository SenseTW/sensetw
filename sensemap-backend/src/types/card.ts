import { gql } from "apollo-server";
import {
  ID,
  Card,
  CardType,
  cardFields,
  cardDataFields,
  cardWithTargetFields,
  SenseObject
} from "./sql";
import { MapFilter, updateMapUpdatedAt } from "./map";
import { objectsQuery } from "./object";
import * as R from "ramda";
import * as A from "./oauth";

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

export function cardsQuery(db) {
  return db.select(cardFields).from("card");
}

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

export async function getObjectsForCard(db, id: ID): Promise<SenseObject[]> {
  return objectsQuery(db).where("cardId", id);
}

export async function createCard(db, args): Promise<Card> {
  const fields = R.pick(cardDataFields, args);
  const rows = await db("card")
    .insert(fields)
    .returning(cardFields);
  await updateMapUpdatedAt(db, rows[0].mapId);
  return rows[0];
}

export async function deleteCard(db, id: ID): Promise<Card | null> {
  const rows = await db("card")
    .where("id", id)
    .delete()
    .returning(cardFields);
  await updateMapUpdatedAt(db, rows[0].mapId);
  return rows[0];
}

export async function updateCard(db, id: ID, args): Promise<Card | null> {
  const fields = R.pick(cardDataFields, args);
  const rows = await db("card")
    .where("id", id)
    .update(fields)
    .returning(cardFields);
  await updateMapUpdatedAt(db, rows[0].mapId);
  return rows[0];
}

export const typeDefs = [
  gql`
    input CardFilter {
      map: MapFilter
      url: String
      tags: String
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
    createCard: async (_, args, { db, authorization }, info) => {
      const u = await A.getUserFromAuthorization(db, authorization);
      args.ownerId = !!u ? u.id : null;
      return createCard(db, R.pick(writableFields, args));
    },

    deleteCard: async (_, { id }, { db }, info) => {
      return deleteCard(db, id);
    },

    updateCard: async (_, args, { db }, info) => {
      return updateCard(db, args.id, R.pick(writableFields, args));
    }
  },
  Card: {
    id: async (o, _, { db }, info): Promise<ID> =>
      typeof o !== "string" ? o.id : o,
    createdAt: async (o, _, { db }, info): Promise<Date> =>
      typeof o !== "string" ? o.createdAt : (await getCard(db, o)).createdAt,
    updatedAt: async (o, _, { db }, info): Promise<Date> =>
      typeof o !== "string" ? o.updatedAt : (await getCard(db, o)).updatedAt,
    cardType: async (o, _, { db }, info): Promise<CardType> =>
      typeof o !== "string" ? o.cardType : (await getCard(db, o)).cardType,
    description: async (o, _, { db }, info): Promise<string> =>
      typeof o !== "string"
        ? o.description
        : (await getCard(db, o)).description,
    saidBy: async (o, _, { db }, info): Promise<string> =>
      typeof o !== "string" ? o.saidBy : (await getCard(db, o)).saidBy,
    stakeholder: async (o, _, { db }, info): Promise<string> =>
      typeof o !== "string"
        ? o.stakeholder
        : (await getCard(db, o)).stakeholder,
    summary: async (o, _, { db }, info): Promise<string> =>
      typeof o !== "string" ? o.summary : (await getCard(db, o)).summary,
    quote: async (o, _, { db }, info): Promise<string> =>
      typeof o !== "string" ? o.quote : (await getCard(db, o)).quote,
    tags: async (o, _, { db }, info): Promise<string> =>
      typeof o !== "string" ? o.tags : (await getCard(db, o)).tags,
    title: async (o, _, { db }, info): Promise<string> =>
      typeof o !== "string" ? o.title : (await getCard(db, o)).title,
    url: async (o, _, { db }, info): Promise<string> =>
      typeof o !== "string" ? o.url : (await getCard(db, o)).url,
    mapId: async (o, _, { db }, info): Promise<ID> =>
      typeof o !== "string" ? o.mapId : (await getCard(db, o)).mapId,
    map: async (o, _, { db }, info): Promise<ID> =>
      typeof o !== "string" ? o.map : (await getCard(db, o)).mapId,
    objects: async (o, _, { db }, info): Promise<SenseObject[]> =>
      typeof o !== "string" ? o.objects : getObjectsForCard(db, o),
    owner: async (o, _, { db }, info): Promise<ID> =>
      typeof o !== "string" ? o.owner : (await getCard(db, o)).ownerId
  }
};
