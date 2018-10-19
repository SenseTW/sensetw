import { gql } from "apollo-server";
import {
  ID,
  Map,
  mapFields,
  SenseObject,
  Card,
  Box,
  Edge
} from "./sql";
import * as T from "./transactions";
import { objectsQuery } from "./object";
import { boxesQuery } from "./box";
import { cardsQuery } from "./card";
import { edgesQuery } from "./edge";
import { getUserFromAuthorization } from "./oauth";

export type MapFilter = {
  id?: ID;
};

type AllMapsArgs = {
  filter?: MapFilter;
};

export function mapsQuery(db) {
  return db.select(mapFields).from("map");
}

export async function getMap(db, id: ID): Promise<Map | null> {
  const m = await mapsQuery(db)
    .where("id", id)
    .first();
  return m === undefined ? null : m;
}

export async function getAllMaps(db): Promise<Map[]> {
  return mapsQuery(db);
}

export async function getObjectsInMap(db, mapId: ID): Promise<SenseObject[]> {
  return objectsQuery(db).where("mapId", mapId);
}

export async function getEdgesInMap(db, mapId: ID): Promise<Edge[]> {
  return edgesQuery(db).where("mapId", mapId);
}

export async function getCardsInMap(db, mapId: ID): Promise<Card[]> {
  return cardsQuery(db).where("mapId", mapId);
}

export async function getBoxesInMap(db, mapId: ID): Promise<Box[]> {
  return boxesQuery(db).where("mapId", mapId);
}

export const typeDefs = [
  gql`
    input MapFilter {
      id: ID!
    }

    extend type Query {
      allMaps(filter: MapFilter): [Map!]!
      Map(id: ID): Map
    }

    extend type Mutation {
      createMap(
        name: String
        description: String
        tags: String
        image: String
        type: String
        boxesIds: [ID!]
        cardsIds: [ID!]
        edgesIds: [ID!]
        objectsIds: [ID!]
      ): Map
      updateMap(
        id: ID!
        name: String
        description: String
        tags: String
        image: String
        type: String
      ): Map
      deleteMap(id: ID!): Map
    }

    type Map @model {
      id: ID! @isUnique
      createdAt: DateTime!
      updatedAt: DateTime!
      owner: User @relation(name: "MapOwners")
      name: String
      description: String
      tags: String
      image: String
      type: String
      objects: [Object!]! @relation(name: "MapObjects")
      edges: [Edge!]! @relation(name: "MapEdges")
      cards: [Card!]! @relation(name: "MapCards")
      boxes: [Box!]! @relation(name: "MapBoxes")
    }
  `
];

export const resolvers = {
  Query: {
    allMaps: async (_, args: AllMapsArgs, { db }, info): Promise<Map[]> => {
      if (args.filter) {
        const m = await getMap(db, args.filter.id);
        return !!m ? [m] : [];
      } else {
        return getAllMaps(db);
      }
    },

    Map: async (_, args, { db }, info): Promise<Map | null> => {
      return getMap(db, args.id);
    }
  },

  Mutation: {
    createMap: async (_, args, { db, authorization }, info): Promise<Map> => {
      const u = await getUserFromAuthorization(db, authorization);
      args.ownerId = !!u ? u.id : null;
      const trx = T.createMap(args);
      const r = await T.run(db, trx);
      return r.transaction.data;
    },

    updateMap: async (_, args, { db }, info): Promise<Map> => {
      const trx = T.updateMap(args.id, args);
      const r = await T.run(db, trx);
      return r.transaction.data;
    },

    deleteMap: async (_, args, { db }, info): Promise<Map> => {
      const trx = T.deleteMap(args.id);
      const r = await T.run(db, trx);
      return r.transaction.data;
    }
  },

  Map: {
    id: async (o, _, { db }, info): Promise<ID> =>
      typeof o !== "string" ? o.id : o,
    createdAt: async (o, _, { db }, info): Promise<Date> =>
      typeof o !== "string" ? o.createdAt : (await getMap(db, o)).createdAt,
    updatedAt: async (o, _, { db }, info): Promise<Date> =>
      typeof o !== "string" ? o.updatedAt : (await getMap(db, o)).updatedAt,
    name: async (o, _, { db }, info): Promise<string> =>
      typeof o !== "string" ? o.name : (await getMap(db, o)).name,
    description: async (o, _, { db }, info): Promise<string> =>
      typeof o !== "string" ? o.description : (await getMap(db, o)).description,
    tags: async (o, _, { db }, info): Promise<string> =>
      typeof o !== "string" ? o.tags : (await getMap(db, o)).tags,
    image: async (o, _, { db }, info): Promise<string> =>
      typeof o !== "string" ? o.image : (await getMap(db, o)).image,
    type: async (o, _, { db }, info): Promise<string> =>
      typeof o !== "string" ? o.type : (await getMap(db, o)).type,
    objects: async (o, _, { db }, info): Promise<SenseObject[]> =>
      typeof o !== "string" ? o.objects : getObjectsInMap(db, o),
    edges: async (o, _, { db }, info): Promise<Edge[]> =>
      typeof o !== "string" ? o.edges : getEdgesInMap(db, o),
    cards: async (o, _, { db }, info): Promise<Card[]> =>
      typeof o !== "string" ? o.cards : getCardsInMap(db, o),
    boxes: async (o, _, { db }, info): Promise<Box[]> =>
      typeof o !== "string" ? o.boxes : getBoxesInMap(db, o)
  }
};
