import { gql } from "apollo-server";
import { EdgeType } from "./primitive";
import { ID, Edge, edgesQuery } from "./sql";
import { getEdgesInMap } from "./map";
import * as T from "./transaction";
import * as A from "./oauth";

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
      createEdge(
        fromId: ID
        mapId: ID
        toId: ID
        edgeType: EdgeType
        title: String
        tags: String
        summary: String
      ): Edge
      updateEdge(
        id: ID!
        fromId: ID
        mapId: ID
        toId: ID
        edgeType: EdgeType
        title: String
        tags: String
        summary: String
      ): Edge
      deleteEdge(id: ID!): Edge
    }

    enum EdgeType {
      NONE
      DIRECTED
      REVERSED
      BIDIRECTED
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
      edgeType: EdgeType @migrationValue(value: NONE)
      title: String
      tags: String
      summary: String
    }
  `
];

type EdgeParent = ID | Edge;

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
    createEdge: async (
      _,
      args,
      { db, user, authorization },
      info
    ): Promise<Edge> => {
      const u = user
        ? user
        : await A.getUserFromAuthorization(db, authorization);
      const trx = T.createEdge(args);
      const r = await T.run(db, u, trx);
      return r.transaction.data;
    },
    updateEdge: async (
      _,
      args,
      { db, user, authorization },
      info
    ): Promise<Edge | null> => {
      const u = user
        ? user
        : await A.getUserFromAuthorization(db, authorization);
      const trx = T.updateEdge(args.id, args);
      const r = await T.run(db, u, trx);
      return r.transaction.data;
    },
    deleteEdge: async (
      _,
      { id },
      { db, user, authorization },
      info
    ): Promise<Edge | null> => {
      const u = user
        ? user
        : await A.getUserFromAuthorization(db, authorization);
      const trx = T.deleteEdge(id);
      const r = await T.run(db, u, trx);
      return r.transaction.data;
    }
  },
  Edge: {
    id: async (o: EdgeParent, {}, { db }): Promise<ID> =>
      typeof o != "string" ? o.id : o,
    createdAt: async (o: EdgeParent, {}, { db }): Promise<Date> =>
      typeof o != "string" ? o.createdAt : (await getEdge(db, o)).createdAt,
    updatedAt: async (o: EdgeParent, {}, { db }): Promise<Date> =>
      typeof o != "string" ? o.updatedAt : (await getEdge(db, o)).updatedAt,
    mapId: async (o: EdgeParent, {}, { db }): Promise<ID> =>
      typeof o != "string" ? o.mapId : (await getEdge(db, o)).mapId,
    fromId: async (o: EdgeParent, {}, { db }): Promise<ID> =>
      typeof o != "string" ? o.fromId : (await getEdge(db, o)).fromId,
    toId: async (o: EdgeParent, {}, { db }): Promise<ID> =>
      typeof o != "string" ? o.toId : (await getEdge(db, o)).toId,
    map: async (o: EdgeParent, {}, { db }): Promise<ID> =>
      typeof o != "string" ? o.mapId : (await getEdge(db, o)).mapId,
    from: async (o: EdgeParent, {}, { db }): Promise<ID> =>
      typeof o != "string" ? o.fromId : (await getEdge(db, o)).fromId,
    to: async (o: EdgeParent, {}, { db }): Promise<ID> =>
      typeof o != "string" ? o.toId : (await getEdge(db, o)).toId,
    edgeType: async (o: EdgeParent, {}, { db }): Promise<EdgeType> =>
      typeof o != "string" ? o.edgeType : (await getEdge(db, o)).edgeType,
    title: async (o: EdgeParent, {}, { db }): Promise<string> =>
      typeof o != "string" ? o.title : (await getEdge(db, o)).title,
    tags: async (o: EdgeParent, {}, { db }): Promise<string> =>
      typeof o != "string" ? o.tags : (await getEdge(db, o)).tags,
    summary: async (o: EdgeParent, {}, { db }): Promise<string> =>
      typeof o != "string" ? o.summary : (await getEdge(db, o)).summary
  }
};
