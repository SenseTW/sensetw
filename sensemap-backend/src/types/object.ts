import { gql } from "apollo-server";
import { ID, SenseObject, objectsQuery } from "./sql";
import { ObjectType } from "./primitive";
import { getObjectsInMap } from "./map";
import * as T from "./transaction";
import * as A from "./oauth";

export async function getAllObjects(db): Promise<SenseObject[]> {
  return objectsQuery(db);
}

export async function getObject(db, id: ID): Promise<SenseObject> {
  const o = await objectsQuery(db)
    .where("id", id)
    .first();
  return !!o ? o : null;
}

export const typeDefs = [
  gql`
    input ObjectFilter {
      id: ID
      map: MapFilter
    }

    input ObjectIDFilter {
      id: ID!
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

type ObjectParent = ID | SenseObject;

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
    createObject: async (
      _,
      args,
      { db, user, authorization },
      info
    ): Promise<Object> => {
      const u = user
        ? user
        : await A.getUserFromAuthorization(db, authorization);
      const trx = T.createObject(args);
      const r = await T.run(db, u, trx);
      return r.payload.data;
    },
    updateObject: async (
      _,
      args,
      { db, user, authorization },
      info
    ): Promise<Object> => {
      const u = user
        ? user
        : await A.getUserFromAuthorization(db, authorization);
      const trx = T.updateObject(args.id, args);
      const r = await T.run(db, u, trx);
      return r.payload.data;
    },
    deleteObject: async (
      _,
      { id },
      { db, user, authorization },
      info
    ): Promise<Object> => {
      const u = user
        ? user
        : await A.getUserFromAuthorization(db, authorization);
      const trx = T.deleteObject(id);
      const r = await T.run(db, u, trx);
      return r.payload.data;
    }
  },
  Object: {
    id: async (o: ObjectParent, {}): Promise<ID> =>
      typeof o !== "string" ? o.id : o,
    createdAt: async (o: ObjectParent, {}, { db }): Promise<Date> =>
      typeof o !== "string" ? o.createdAt : (await getObject(db, o)).createdAt,
    updatedAt: async (o: ObjectParent, {}, { db }): Promise<Date> =>
      typeof o !== "string" ? o.updatedAt : (await getObject(db, o)).updatedAt,
    x: async (o: ObjectParent, {}, { db }): Promise<number> =>
      typeof o !== "string" ? o.x : (await getObject(db, o)).x,
    y: async (o: ObjectParent, {}, { db }): Promise<number> =>
      typeof o !== "string" ? o.y : (await getObject(db, o)).y,
    width: async (o: ObjectParent, {}, { db }): Promise<number> =>
      typeof o !== "string" ? o.width : (await getObject(db, o)).width,
    height: async (o: ObjectParent, {}, { db }): Promise<number> =>
      typeof o !== "string" ? o.height : (await getObject(db, o)).height,
    zIndex: async (o: ObjectParent, {}, { db }): Promise<number> =>
      typeof o !== "string" ? o.zIndex : (await getObject(db, o)).zIndex,
    objectType: async (o: ObjectParent, {}, { db }): Promise<ObjectType> =>
      typeof o !== "string"
        ? o.objectType
        : (await getObject(db, o)).objectType,
    mapId: async (o: ObjectParent, {}, { db }): Promise<ID> =>
      typeof o !== "string" ? o.mapId : (await getObject(db, o)).mapId,
    cardId: async (o: ObjectParent, {}, { db }): Promise<ID> =>
      typeof o !== "string" ? o.cardId : (await getObject(db, o)).cardId,
    boxId: async (o: ObjectParent, {}, { db }): Promise<ID> =>
      typeof o !== "string" ? o.boxId : (await getObject(db, o)).boxId,
    belongsToId: async (o: ObjectParent, {}, { db }): Promise<ID> =>
      typeof o !== "string"
        ? o.belongsToId
        : (await getObject(db, o)).belongsToId,
    map: async (o: ObjectParent, {}, { db }): Promise<ID> =>
      typeof o !== "string" ? o.mapId : (await getObject(db, o)).mapId,
    card: async (o: ObjectParent, {}, { db }): Promise<ID> =>
      typeof o !== "string" ? o.cardId : (await getObject(db, o)).cardId,
    box: async (o: ObjectParent, {}, { db }): Promise<ID> =>
      typeof o !== "string" ? o.boxId : (await getObject(db, o)).boxId,
    belongsTo: async (o: ObjectParent, {}, { db }): Promise<ID> =>
      typeof o !== "string"
        ? o.belongsToId
        : (await getObject(db, o)).belongsToId
  }
};
