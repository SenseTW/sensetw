import { gql } from "apollo-server";
import { ID, Map, SenseObject, Edge, edgeFields } from "./sql";
import { getEdgesInMap } from "./map";
import * as T from "./transactions";

export function edgesQuery(db) {
  return db.select(edgeFields).from("edge");
}

export async function getAllEdges(db): Promise<Edge[]> {
  return edgesQuery(db).from("edge");
}

export async function getEdge(db, id: ID): Promise<Edge | null> {
  const e = await edgesQuery(db)
    .where("id", id)
    .first();
  return !!e ? e : null;
}

export const typeDefs = [
  gql`
    input EdgeFilter {
      map: MapFilter
    }

    extend type Query {
      allEdges(filter: EdgeFilter): [Edge!]!
      Edge(id: ID): Edge
    }

    extend type Mutation {
      createEdge(fromId: ID, mapId: ID, toId: ID): Edge
      updateEdge(id: ID!, fromId: ID, mapId: ID, toId: ID): Edge
      deleteEdge(id: ID!): Edge
    }

    type Edge @model {
      id: ID! @isUnique
      createdAt: DateTime!
      updatedAt: DateTime!
      mapId: ID
      map: Map! @relation(name: "MapEdges")
      fromId: ID
      from: Object! @relation(name: "EdgeFrom")
      toId: ID
      to: Object! @relation(name: "EdgeTo")
    }
  `
];

export const resolvers = {
  Query: {
    allEdges: async (_, args, { db }, info): Promise<Edge[]> => {
      if (args.filter) {
        return getEdgesInMap(db, args.filter.map.id);
      } else {
        return getAllEdges(db);
      }
    },
    Edge: async (_, { id }, { db }, info): Promise<Edge | null> => {
      return getEdge(db, id);
    }
  },
  Mutation: {
    createEdge: async (_, args, { db }, info): Promise<Edge> => {
      const trx = T.createEdge(args);
      const r = await T.run(db, trx);
      return r.transaction.data;
    },
    updateEdge: async (_, args, { db }, info): Promise<Edge | null> => {
      const trx = T.updateEdge(args.id, args);
      const r = await T.run(db, trx);
      return r.transaction.data;
    },
    deleteEdge: async (_, { id }, { db }, info): Promise<Edge | null> => {
      const trx = T.deleteEdge(id);
      const r = await T.run(db, trx);
      return r.transaction.data;
    }
  },
  Edge: {
    id: async (o, _, { db }, info): Promise<ID> =>
      typeof o != "string" ? o.id : o,
    createdAt: async (o, _, { db }, info): Promise<Date> =>
      typeof o != "string" ? o.createdAt : (await getEdge(db, o)).createdAt,
    updatedAt: async (o, _, { db }, info): Promise<Date> =>
      typeof o != "string" ? o.updatedAt : (await getEdge(db, o)).updatedAt,
    mapId: async (o, _, { db }, info): Promise<ID> =>
      typeof o != "string" ? o.mapId : (await getEdge(db, o)).mapId,
    fromId: async (o, _, { db }, info): Promise<ID> =>
      typeof o != "string" ? o.fromId : (await getEdge(db, o)).fromId,
    toId: async (o, _, { db }, info): Promise<ID> =>
      typeof o != "string" ? o.toId : (await getEdge(db, o)).toId,
    map: async (o, _, { db }, info): Promise<Map> =>
      typeof o != "string" ? o.map : (await getEdge(db, o)).mapId,
    from: async (o, _, { db }, info): Promise<SenseObject> =>
      typeof o != "string" ? o.from : (await getEdge(db, o)).fromId,
    to: async (o, _, { db }, info): Promise<SenseObject> =>
      typeof o != "string" ? o.to : (await getEdge(db, o)).toId
  }
};
