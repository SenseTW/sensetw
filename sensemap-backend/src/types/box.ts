import { ID, Map, Box, boxFields, boxDataFields } from './sql';
import { getMap, getBoxesInMap } from './map';
import { pick } from 'ramda';

export async function getAllBoxes(db): Promise<Box[]> {
  return db.select(boxFields).from('box');
}

export async function getBox(db, id: ID): Promise<Box | null> {
  return db.select(boxFields).from('box').where('id', id);
}

export async function createBox(db, args): Promise<Box> {
  const fields = pick(boxDataFields, args);
  const rows = await db('box').insert(fields).returning(boxFields);
  return rows[0];
}

export async function deleteBox(db, id: ID): Promise<Box> {
  const rows = await db('box').where('id', id).delete().returning(boxFields);
  return rows[0];
}

export async function updateBox(db, id: ID, args): Promise<Box | null> {
  const fields = pick(boxDataFields, args);
  const rows = await db('box').where('id', id).update(fields).returning(boxFields);
  return rows[0];
}

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
    },
  },
  Mutation: {
    createBox: async (_, args, { db }, info) => {
      return createBox(db, args);
    },
    deleteBox: async (_, { id }, { db }, info) => {
      return deleteBox(db, id);
    },
    updateBox: async (_, args, { db }, info) => {
      return updateBox(db, args.id, args);
    },
  },
  Box: {
    id:        (o, _, context, info): ID     => o.id,
    createdAt: (o, _, context, info): Date   => o.createdAt,
    updatedAt: (o, _, context, info): Date   => o.updatedAt,
    title:     (o, _, context, info): ID     => o.title,
    summary:   (o, _, context, info): string => o.summary,
    tags:      (o, _, context, info): string => o.tags,
    mapId:     (o, _, context, info): ID     => o.mapId,

    map: async (o, _, { db }, info): Promise<Map | null> => getMap(db, o.mapId),
  },
};
