import { gql } from "apollo-server";
import {
  ID,
  Box,
  BoxType,
  boxFields,
  objectFields,
  boxDataFields,
  SenseObject
} from "./sql";
import { getBoxesInMap, updateMapUpdatedAt } from "./map";
import { objectsQuery } from "./object";
import { pick } from "ramda";
import * as A from "./oauth";

export function boxesQuery(db) {
  return db.select(boxFields(db)).from("box");
}

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
  return objectsQuery(db).where("belongsTo", id);
}

export async function createBox(db, args): Promise<Box> {
  const fields = pick(boxDataFields, args);
  const rows = await db("box")
    .insert(fields)
    .returning(boxFields(db));
  await updateMapUpdatedAt(db, rows[0].mapId);
  return rows[0];
}

export async function deleteBox(db, id: ID): Promise<Box> {
  const rows = await db("box")
    .where("id", id)
    .delete()
    .returning(boxFields(db));
  await updateMapUpdatedAt(db, rows[0].mapId);
  return rows[0];
}

export async function updateBox(db, id: ID, args): Promise<Box | null> {
  const fields = pick(boxDataFields, args);
  const rows = await db("box")
    .where("id", id)
    .update(fields)
    .returning(boxFields(db));
  await updateMapUpdatedAt(db, rows[0].mapId);
  return rows[0];
}

export async function addObjectToBox(db, obj: ID, box: ID) {
  const rows = await db("object")
    .where("id", obj)
    .update({ belongsToId: box })
    .returning(objectFields(db));
  await updateMapUpdatedAt(db, rows[0].mapId);
  return {
    containsObject: obj,
    belongsToBox: box
  };
}

export async function removeObjectFromBox(db, obj: ID, box: ID) {
  const rows = await db("object")
    .where("id", obj)
    .update({ belongsToId: db.raw("NULL") })
    .returning(objectFields(db));
  await updateMapUpdatedAt(db, rows[0].mapId);
  return {
    containsObject: obj,
    belongsToBox: box
  };
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
    createBox: async (_, args, { db, authorization }, info) => {
      const u = await A.getUserFromAuthorization(db, authorization);
      args.ownerId = !!u ? u.id : null;
      return createBox(db, args);
    },
    deleteBox: async (_, { id }, { db }, info) => {
      return deleteBox(db, id);
    },
    updateBox: async (_, args, { db }, info) => {
      return updateBox(db, args.id, args);
    },
    addToContainCards: async (
      _,
      { belongsToBoxId, containsObjectId },
      { db },
      info
    ) => {
      return addObjectToBox(db, containsObjectId, belongsToBoxId);
    },
    removeFromContainCards: async (
      _,
      { belongsToBoxId, containsObjectId },
      { db },
      info
    ) => {
      return removeObjectFromBox(db, containsObjectId, belongsToBoxId);
    }
  },
  Box: {
    id: async (o, _, { db }, info): Promise<ID> =>
      typeof o !== "string" ? o.id : o,
    createdAt: async (o, _, { db }, info): Promise<Date> =>
      typeof o !== "string" ? o.createdAt : (await getBox(db, o)).createdAt,
    updatedAt: async (o, _, { db }, info): Promise<Date> =>
      typeof o !== "string" ? o.updatedAt : (await getBox(db, o)).updatedAt,
    boxType: async (o, _, { db }, info): Promise<BoxType> =>
      typeof o !== "string" ? o.boxType : (await getBox(db, o)).boxType,
    title: async (o, _, { db }, info): Promise<ID> =>
      typeof o !== "string" ? o.title : (await getBox(db, o)).title,
    summary: async (o, _, { db }, info): Promise<string> =>
      typeof o !== "string" ? o.summary : (await getBox(db, o)).summary,
    tags: async (o, _, { db }, info): Promise<string> =>
      typeof o !== "string" ? o.tags : (await getBox(db, o)).tags,
    mapId: async (o, _, { db }, info): Promise<ID> =>
      typeof o !== "string" ? o.mapId : (await getBox(db, o)).mapId,
    map: async (o, _, { db }, info): Promise<ID> =>
      typeof o !== "string" ? o.map : (await getBox(db, o)).mapId,
    objects: async (o, _, { db }, info): Promise<SenseObject[]> =>
      typeof o !== "string" ? o.objects : getObjectsForBox(db, o),
    contains: async (o, _, { db }, info): Promise<SenseObject[]> =>
      typeof o !== "string" ? o.contains : getObjectsInBox(db, o),
    owner: async (o, _, { db }, info): Promise<ID> =>
      typeof o !== "string" ? o.owner : (await getBox(db, o)).ownerId
  }
};
