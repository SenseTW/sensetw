import { ID, Map, SenseObject, Edge, edgeFields, edgeDataFields } from './sql';
import { getMap, getEdgesInMap } from './map';
import { getObject } from './object';
import { pick } from 'ramda';

export async function getAllEdges(db): Promise<Edge[]> {
  return db.select(edgeFields).from('edge');
}

export async function getEdge(db, id: ID): Promise<Edge | null> {
  return db.select(edgeFields).from('edge').where('id', id);
}

export async function createEdge(db, args): Promise<Edge> {
  const fields = pick(edgeDataFields, args);
  const rows = await db('edge').insert(fields).returning(edgeFields);
  return rows[0];
}

export async function updateEdge(db, id: ID, args): Promise<Edge | null> {
  const fields = pick(edgeDataFields, args);
  const rows = await db('edge').where('id', id).update(fields).returning(edgeFields);
  return rows[0];
}

export async function deleteEdge(db, id: ID): Promise<Edge | null> {
  const rows = await db('edge').where('id', id).delete().returning(edgeFields);
  return rows[0];
}


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
    id:        (o, _, context, info): ID     => o.id,
    createdAt: (o, _, context, info): Date   => o.createdAt,
    updatedAt: (o, _, context, info): Date   => o.updatedAt,
    mapId:     (o, _, context, info): ID     => o.mapId,
    fromId:    (o, _, context, info): ID     => o.fromId,
    toId:      (o, _, context, info): ID     => o.toId,

    map:  async (o, _, { db }, info): Promise<Map> =>         getMap(db, o.mapId),
    from: async (o, _, { db }, info): Promise<SenseObject> => getObject(db, o.fromId),
    to:   async (o, _, { db }, info): Promise<SenseObject> => getObject(db, o.toId),
  },
};
