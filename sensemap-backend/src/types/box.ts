import { gql } from "apollo-server";
import { ID, Box, SenseObject, objectsQuery, boxesQuery } from "./sql";
import { BoxType } from "./primitive";
import { getBoxesInMap } from "./map";
import * as T from "./transaction";
import * as A from "./oauth";

export async function getAllBoxes(db): Promise<Box[]> {
  return boxesQuery(db);
}

export async function getBox(db, id: ID): Promise<Box | null> {
  const b = await boxesQuery(db)
    .where("id", id)
    .first();
  return b === undefined ? null : b;
}

export async function getObjectsForBox(db, id: ID): Promise<SenseObject[]> {
  return objectsQuery(db).where("boxId", id);
}

export async function getObjectsInBox(db, id: ID): Promise<SenseObject[]> {
  return objectsQuery(db).where("belongsToId", id);
}

export const typeDefs = [
  gql`
    input BoxFilter {
      map: MapFilter
    }

    extend type Query {
      allBoxes(filter: BoxFilter): [Box!]!
      Box(id: ID): Box
    }

    type AddToContainCardsPayload {
      containsObject: Object!
      belongsToBox: Box!
    }

    type RemoveFromContainCardsPayload {
      containsObject: Object!
      belongsToBox: Box!
    }

    extend type Mutation {
      createBox(
        boxType: BoxType
        summary: String
        tags: String
        title: String
        mapId: ID
        containsIds: [ID!]
        objectsIds: [ID!]
      ): Box
      updateBox(
        id: ID!
        boxType: BoxType
        summary: String
        tags: String
        title: String
        mapId: ID
        containsIds: [ID!]
        objectsIds: [ID!]
      ): Box
      deleteBox(id: ID!): Box
      addToContainCards(
        belongsToBoxId: ID!
        containsObjectId: ID!
      ): AddToContainCardsPayload
      removeFromContainCards(
        belongsToBoxId: ID!
        containsObjectId: ID!
      ): RemoveFromContainCardsPayload
    }

    enum BoxType {
      NOTE
      PROBLEM
      SOLUTION
      DEFINITION
      INFO
    }

    type Box @model {
      id: ID! @isUnique
      boxType: BoxType
      createdAt: DateTime!
      updatedAt: DateTime!
      title: String
      summary: String
      tags: String
      objects: [Object!]! @relation(name: "ObjectBox")
      contains: [Object!]! @relation(name: "ContainCards")
      mapId: ID
      map: Map @relation(name: "MapBoxes")
      owner: User
    }
  `
];

type BoxParent = ID | Box;

export const resolvers = {
  Query: {
    allBoxes: async (_, args, { db }, info): Promise<Box[]> => {
      if (args.filter) {
        return getBoxesInMap(db, args.filter.map.id);
      } else {
        return getAllBoxes(db);
      }
    },
    Box: async (_, { id }, { db }, info): Promise<Box | null> => {
      return getBox(db, id);
    }
  },
  Mutation: {
    createBox: async (
      _,
      args,
      { db, user, authorization },
      info
    ): Promise<Box> => {
      const u = user
        ? user
        : await A.getUserFromAuthorization(db, authorization);
      args.ownerId = !!u ? u.id : null;
      const trx = T.createBox(args);
      const r = await T.run(db, u, trx);
      return r.transaction.data;
    },
    deleteBox: async (
      _,
      { id },
      { db, user, authorization },
      info
    ): Promise<Box> => {
      const u = user
        ? user
        : await A.getUserFromAuthorization(db, authorization);
      const trx = T.deleteBox(id);
      const r = await T.run(db, u, trx);
      return r.transaction.data;
    },
    updateBox: async (
      _,
      args,
      { db, user, authorization },
      info
    ): Promise<Box> => {
      const u = user
        ? user
        : await A.getUserFromAuthorization(db, authorization);
      const trx = T.updateBox(args.id, args);
      const r = await T.run(db, u, trx);
      return r.transaction.data;
    },
    addToContainCards: async (
      _,
      { belongsToBoxId, containsObjectId },
      { db, user, authorization },
      info
    ) => {
      const u = user
        ? user
        : await A.getUserFromAuthorization(db, authorization);
      const trx = T.addObjectToBox(containsObjectId, belongsToBoxId);
      const r = await T.run(db, u, trx);
      return r.transaction.data;
    },
    removeFromContainCards: async (
      _,
      { belongsToBoxId, containsObjectId },
      { db, user, authorization },
      info
    ) => {
      const u = user
        ? user
        : await A.getUserFromAuthorization(db, authorization);
      const trx = T.removeObjectFromBox(containsObjectId, belongsToBoxId);
      const r = await T.run(db, u, trx);
      return r.transaction.data;
    }
  },
  Box: {
    id: async (o: BoxParent): Promise<ID> => (typeof o !== "string" ? o.id : o),
    createdAt: async (o: BoxParent, {}, { db }): Promise<Date> =>
      typeof o !== "string" ? o.createdAt : (await getBox(db, o)).createdAt,
    updatedAt: async (o: BoxParent, {}, { db }): Promise<Date> =>
      typeof o !== "string" ? o.updatedAt : (await getBox(db, o)).updatedAt,
    boxType: async (o: BoxParent, {}, { db }): Promise<BoxType> =>
      typeof o !== "string" ? o.boxType : (await getBox(db, o)).boxType,
    title: async (o: BoxParent, {}, { db }): Promise<ID> =>
      typeof o !== "string" ? o.title : (await getBox(db, o)).title,
    summary: async (o: BoxParent, {}, { db }): Promise<string> =>
      typeof o !== "string" ? o.summary : (await getBox(db, o)).summary,
    tags: async (o: BoxParent, {}, { db }): Promise<string> =>
      typeof o !== "string" ? o.tags : (await getBox(db, o)).tags,
    mapId: async (o: BoxParent, {}, { db }): Promise<ID> =>
      typeof o !== "string" ? o.mapId : (await getBox(db, o)).mapId,
    map: async (o: BoxParent, {}, { db }): Promise<ID> =>
      typeof o !== "string" ? o.mapId : (await getBox(db, o)).mapId,
    objects: async (o: BoxParent, {}, { db }): Promise<SenseObject[]> =>
      typeof o !== "string"
        ? getObjectsForBox(db, o.id)
        : getObjectsForBox(db, o),
    contains: async (o: BoxParent, {}, { db }): Promise<SenseObject[]> =>
      typeof o !== "string"
        ? getObjectsInBox(db, o.id)
        : getObjectsInBox(db, o),
    owner: async (o: BoxParent, {}, { db }): Promise<ID> =>
      typeof o !== "string" ? o.ownerId : (await getBox(db, o)).ownerId
  }
};
