import { gql } from "apollo-server";
import {
  ID,
  HasID,
  Map,
  mapsQuery,
  SenseObject,
  objectsQuery,
  Card,
  cardsQuery,
  Box,
  boxesQuery,
  Edge,
  edgesQuery
} from "./sql";
import * as T from "./transaction";
import * as A from "./oauth";

export type MapFilter = {
  id?: ID;
};

type AllMapsArgs = {
  filter?: MapFilter;
};

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

    input MapIDFilter {
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

type MapParent = ID | Map;

export const resolvers = {
  Query: {
    allMaps: async (_, args: AllMapsArgs, { db }): Promise<Map[]> => {
      if (args.filter) {
        const m = await getMap(db, args.filter.id);
        return !!m ? [m] : [];
      } else {
        return getAllMaps(db);
      }
    },

    Map: async (_, args: HasID, { db }): Promise<Map | null> => {
      return getMap(db, args.id);
    }
  },

  Mutation: {
    createMap: async (
      _,
      args,
      { db, user, authorization },
      info
    ): Promise<Map> => {
      const u = user
        ? user
        : await A.getUserFromAuthorization(db, authorization);
      args.ownerId = !!u ? u.id : null;
      const trx = T.createMap(args);
      const r = await T.run(db, u, trx);
      return r.payload.data;
    },

    updateMap: async (
      _,
      args,
      { db, user, authorization },
      info
    ): Promise<Map> => {
      const u = user
        ? user
        : await A.getUserFromAuthorization(db, authorization);
      const trx = T.updateMap(args.id, args);
      const r = await T.run(db, u, trx);
      return r.payload.data;
    },

    deleteMap: async (
      _,
      args,
      { db, user, authorization },
      info
    ): Promise<Map> => {
      const u = user
        ? user
        : await A.getUserFromAuthorization(db, authorization);
      const trx = T.deleteMap(args.id);
      const r = await T.run(db, u, trx);
      return r.payload.data;
    }
  },

  Map: {
    id: async (o: MapParent): Promise<ID> =>
      typeof o !== "string" ? o.id : o,
    createdAt: async (o: MapParent, {}, { db }): Promise<Date> =>
      typeof o !== "string" ? o.createdAt : (await getMap(db, o)).createdAt,
    updatedAt: async (o: MapParent, {}, { db }): Promise<Date> =>
      typeof o !== "string" ? o.updatedAt : (await getMap(db, o)).updatedAt,
    name: async (o: MapParent, {}, { db }): Promise<string> =>
      typeof o !== "string" ? o.name : (await getMap(db, o)).name,
    description: async (o: MapParent, {}, { db }): Promise<string> =>
      typeof o !== "string" ? o.description : (await getMap(db, o)).description,
    tags: async (o: MapParent, {}, { db }): Promise<string> =>
      typeof o !== "string" ? o.tags : (await getMap(db, o)).tags,
    image: async (o: MapParent, {}, { db }): Promise<string> =>
      typeof o !== "string" ? o.image : (await getMap(db, o)).image,
    type: async (o: MapParent, {}, { db }): Promise<string> =>
      typeof o !== "string" ? o.type : (await getMap(db, o)).type,
    objects: async (o: MapParent, {}, { db }): Promise<SenseObject[]> =>
      typeof o !== "string" ? getObjectsInMap(db, o.id) : getObjectsInMap(db, o),
    edges: async (o: MapParent, {}, { db }): Promise<Edge[]> =>
      typeof o !== "string" ? getEdgesInMap(db, o.id) : getEdgesInMap(db, o),
    cards: async (o: MapParent, {}, { db }): Promise<Card[]> =>
      typeof o !== "string" ? getCardsInMap(db, o.id) : getCardsInMap(db, o),
    boxes: async (o: MapParent, {}, { db }): Promise<Box[]> =>
      typeof o !== "string" ? getBoxesInMap(db, o.id) : getBoxesInMap(db, o)
  }
};
