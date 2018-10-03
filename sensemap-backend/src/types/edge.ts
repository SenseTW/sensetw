import { gql } from 'apollo-server';
import { ID, Map, SenseObject, Edge, edgeFields, edgeDataFields } from './sql';
import { getEdgesInMap, updateMapUpdatedAt } from './map';
import { pick } from 'ramda';

export function edgesQuery(db) {
  return db.select(edgeFields(db)).from('edge');
}

export async function getAllEdges(db): Promise<Edge[]> {
  return edgesQuery(db).from('edge');
}

export async function getEdge(db, id: ID): Promise<Edge | null> {
  const e = await edgesQuery(db).where('id', id).first();
  return !!e ? e : null;
}

export async function createEdge(db, args): Promise<Edge> {
  const fields = pick(edgeDataFields, args);
  const rows = await db('edge').insert(fields).returning(edgeFields(db));
  await updateMapUpdatedAt(db, rows[0].mapId);
  return rows[0];
}

export async function updateEdge(db, id: ID, args): Promise<Edge | null> {
  const fields = pick(edgeDataFields, args);
  const rows = await db('edge').where('id', id).update(fields).returning(edgeFields(db));
  await updateMapUpdatedAt(db, rows[0].mapId);
  return rows[0];
}

export async function deleteEdge(db, id: ID): Promise<Edge | null> {
  const rows = await db('edge').where('id', id).delete().returning(edgeFields(db));
  await updateMapUpdatedAt(db, rows[0].mapId);
  return rows[0];
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
        fromId: ID,
        mapId: ID,
        toId: ID,
      ): Edge
      updateEdge(
        id: ID!,
        fromId: ID,
        mapId: ID,
        toId: ID,
      ): Edge
      deleteEdge(
        id: ID!
      ): Edge
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
  `,
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
    },
  },
  Mutation: {
    createEdge: async (_, args, { db }, info): Promise<Edge> => {
      return createEdge(db, args);
    },
    updateEdge: async (_, args, { db }, info): Promise<Edge | null> => {
      return updateEdge(db, args.id, args);
    },
    deleteEdge: async (_, { id }, { db }, info): Promise<Edge | null> => {
      return deleteEdge(db, id);
    },
  },
  Edge: {
    id:        async (o, _, { db }, info): Promise<ID>   => typeof(o) != 'string' ? o.id        : o,
    createdAt: async (o, _, { db }, info): Promise<Date> => typeof(o) != 'string' ? o.createdAt : (await getEdge(db, o)).createdAt,
    updatedAt: async (o, _, { db }, info): Promise<Date> => typeof(o) != 'string' ? o.updatedAt : (await getEdge(db, o)).updatedAt,
    mapId:     async (o, _, { db }, info): Promise<ID>   => typeof(o) != 'string' ? o.mapId     : (await getEdge(db, o)).mapId,
    fromId:    async (o, _, { db }, info): Promise<ID>   => typeof(o) != 'string' ? o.fromId    : (await getEdge(db, o)).fromId,
    toId:      async (o, _, { db }, info): Promise<ID>   => typeof(o) != 'string' ? o.toId      : (await getEdge(db, o)).toId,
    map:       async (o, _, { db }, info): Promise<Map>  => typeof(o) != 'string' ? o.map       : (await getEdge(db, o)).mapId,
    from:      async (o, _, { db }, info): Promise<SenseObject> => typeof(o) != 'string' ? o.from : (await getEdge(db, o)).fromId,
    to:        async (o, _, { db }, info): Promise<SenseObject> => typeof(o) != 'string' ? o.to   : (await getEdge(db, o)).toId,
  },
};
