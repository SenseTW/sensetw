import { gql } from "apollo-server";
import { ID, SenseObject, objectFields, objectDataFields } from "./sql";
import { getObjectsInMap, updateMapUpdatedAt } from "./map";
import { pick } from "ramda";

export function objectsQuery(db) {
  return db.select(objectFields(db)).from("object");
}

export async function getAllObjects(db): Promise<SenseObject[]> {
  return objectsQuery(db);
}

export async function getObject(db, id: ID): Promise<SenseObject> {
  const o = await objectsQuery(db)
    .where("id", id)
    .first();
  return !!o ? o : null;
}

export async function createObject(db, args): Promise<SenseObject> {
  const fields = pick(objectDataFields, args);
  const rows = await db("object")
    .insert(fields)
    .returning(objectFields(db));
  await updateMapUpdatedAt(db, rows[0].mapId);
  return rows[0];
}

export async function updateObject(
  db,
  id: ID,
  args
): Promise<SenseObject | null> {
  const fields = pick(objectDataFields, args);
  const rows = await db("object")
    .where("id", id)
    .update(fields)
    .returning(objectFields(db));
  await updateMapUpdatedAt(db, rows[0].mapId);
  return rows[0];
}

export async function deleteObject(db, id: ID): Promise<SenseObject | null> {
  const rows = await db("object")
    .where("id", id)
    .del()
    .returning(objectFields(db));
  await updateMapUpdatedAt(db, rows[0].mapId);
  return rows[0];
}

export const typeDefs = [
  gql`
    input ObjectFilter {
      map: MapFilter
    }

    extend type Query {
      allObjects(filter: ObjectFilter): [Object!]!
      Object(id: ID): Object
    }

    extend type Mutation {
      createObject(
        objectType: ObjectType!
        x: Float!
        y: Float!
        width: Float!
        height: Float!
        zIndex: Float!
        belongsToId: ID
        boxId: ID
        cardId: ID
        mapId: ID
        incomingIds: [ID!]
        outgoingIds: [ID!]
      ): Object
      updateObject(
        id: ID!
        objectType: ObjectType
        x: Float
        y: Float
        width: Float
        height: Float
        zIndex: Float
        belongsToId: ID
        boxId: ID
        cardId: ID
        mapId: ID
        incomingIds: [ID!]
        outgoingIds: [ID!]
      ): Object
      deleteObject(id: ID!): Object
    }

    enum ObjectType {
      CARD
      BOX
    }

    type Object {
      id: ID! @isUnique
      createdAt: DateTime!
      updatedAt: DateTime!
      x: Float!
      y: Float!
      width: Float!
      height: Float!
      zIndex: Float!
      mapId: ID
      map: Map @relation(name: "MapObjects")
      objectType: ObjectType! @migrationValue(value: CARD)
      cardId: ID
      card: Card @relation(name: "ObjectCard")
      boxId: ID
      box: Box @relation(name: "ObjectBox")
      belongsToId: ID
      belongsTo: Box @relation(name: "ContainCards")
      outgoing: [Edge!]! @relation(name: "EdgeFrom")
      incoming: [Edge!]! @relation(name: "EdgeTo")
    }
  `
];

export const resolvers = {
  Query: {
    allObjects: async (_, args, { db }, info): Promise<SenseObject[]> => {
      if (args.filter) {
        return getObjectsInMap(db, args.filter.map.id);
      } else {
        return getAllObjects(db);
      }
    },
    Object: async (_, { id }, { db }, info): Promise<SenseObject | null> => {
      return getObject(db, id);
    }
  },
  Mutation: {
    createObject: async (_, args, { db }, info) => {
      return createObject(db, args);
    },
    updateObject: async (_, args, { db }, info) => {
      return updateObject(db, args.id, args);
    },
    deleteObject: async (_, { id }, { db }, info) => {
      return deleteObject(db, id);
    }
  },
  Object: {
    id: (o, _, context, info): ID => o.id || o,
    createdAt: (o, _, context, info): Date => o.createdAt,
    updatedAt: (o, _, context, info): Date => o.updatedAt,
    x: (o, _, context, info): number => o.x,
    y: (o, _, context, info): number => o.y,
    width: (o, _, context, info): number => o.width,
    height: (o, _, context, info): number => o.height,
    zIndex: (o, _, context, info): number => o.zIndex,
    mapId: (o, _, context, info): number => o.mapId,
    objectType: (o, _, context, info): number => o.objectType,
    cardId: (o, _, context, info): number => o.cardId,
    boxId: (o, _, context, info): number => o.boxId,
    belongsToId: (o, _, context, info): number => o.belongsToId,

    map: async (o, _, { db }, info): Promise<ID> => o.map,
    card: async (o, _, { db }, info): Promise<ID> => o.card,
    box: async (o, _, { db }, info): Promise<ID> => o.box,
    belongsTo: async (o, _, { db }, info): Promise<ID> => o.belongsTo
  }
};
