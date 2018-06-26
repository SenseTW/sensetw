import { ID, Map, Box, boxFields, boxDataFields, SenseObject } from './sql';
import { getMap, getBoxesInMap } from './map';
import { objectsQuery } from './object';
import { pick } from 'ramda';

export function boxesQuery(db) {
  return db.select(boxFields(db)).from('box');
}

export async function getAllBoxes(db): Promise<Box[]> {
  return boxesQuery(db);
}

export async function getBox(db, id: ID): Promise<Box | null> {
  return boxesQuery(db).where('id', id).first();
}

export async function getObjectsForBox(db, id: ID): Promise<SenseObject[]> {
  return objectsQuery(db).where('boxId', id);
}

export async function getObjectsInBox(db, id: ID): Promise<SenseObject[]> {
  return objectsQuery(db).where('belongsTo', id);
}

export async function createBox(db, args): Promise<Box> {
  const fields = pick(boxDataFields, args);
  const rows = await db('box').insert(fields).returning(boxFields(db));
  return rows[0];
}

export async function deleteBox(db, id: ID): Promise<Box> {
  const rows = await db('box').where('id', id).delete().returning(boxFields(db));
  return rows[0];
}

export async function updateBox(db, id: ID, args): Promise<Box | null> {
  const fields = pick(boxDataFields, args);
  const rows = await db('box').where('id', id).update(fields).returning(boxFields(db));
  return rows[0];
}

export async function addObjectToBox(db, obj: ID, box: ID) {
  await db('object').where('id', obj).update({ belongsToId: box });
  return {
    containsObject: obj,
    belongsToBox: box,
  };
}

export async function removeObjectFromBox(db, obj: ID, box: ID) {
  await db('object').where('id', obj).update({ belongsToId: db.raw('NULL') });
  return {
    containsObject: obj,
    belongsToBox: box,
  };
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
    addToContainCards: async (_, { belongsToBoxId, containsObjectId }, { db }, info) => {
      return addObjectToBox(db, containsObjectId, belongsToBoxId);
    },
    removeFromContainCards: async (_, { belongsToBoxId, containsObjectId }, { db }, info) => {
      return removeObjectFromBox(db, containsObjectId, belongsToBoxId);
    },
  },
  Box: {
    id:        async (o, _, { db }, info): Promise<ID>     => typeof(o) !== 'string' ? o.id        : o,
    createdAt: async (o, _, { db }, info): Promise<Date>   => typeof(o) !== 'string' ? o.createdAt : (await getBox(db, o)).createdAt,
    updatedAt: async (o, _, { db }, info): Promise<Date>   => typeof(o) !== 'string' ? o.updatedAt : (await getBox(db, o)).updatedAt,
    title:     async (o, _, { db }, info): Promise<ID>     => typeof(o) !== 'string' ? o.title     : (await getBox(db, o)).title,
    summary:   async (o, _, { db }, info): Promise<string> => typeof(o) !== 'string' ? o.summary   : (await getBox(db, o)).summary,
    tags:      async (o, _, { db }, info): Promise<string> => typeof(o) !== 'string' ? o.tags      : (await getBox(db, o)).tags,
    mapId:     async (o, _, { db }, info): Promise<ID>     => typeof(o) !== 'string' ? o.mapId     : (await getBox(db, o)).mapId,
    map:       async (o, _, { db }, info): Promise<ID>     => typeof(o) !== 'string' ? o.map       : (await getBox(db, o)).mapId,
    objects:   async (o, _, { db }, info): Promise<SenseObject[]> => typeof(o) !== 'string' ? o.objects  : getObjectsForBox(db, o),
    contains:  async (o, _, { db }, info): Promise<SenseObject[]> => typeof(o) !== 'string' ? o.contains : getObjectsInBox(db, o),
  },
};
