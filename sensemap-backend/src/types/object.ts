import { ID, Map, Card, Box, SenseObject, objectFields, objectDataFields } from './sql';
import { getMap, getObjectsInMap } from './map';
import { getCard } from './card';
import { getBox } from './box';
import { pick } from 'ramda';

export async function getAllObjects(db): Promise<SenseObject[]> {
  return db.select(objectFields).from('object');
}

export async function getObject(db, id: ID): Promise<SenseObject> {
  return db.select(objectFields).from('object').where('id', id);
}

export async function createObject(db, args): Promise<SenseObject> {
  const fields = pick(objectDataFields, args);
  const rows = await db('object').insert(fields).returning(objectFields);
  return rows[0];
}

export async function updateObject(db, id: ID, args): Promise<SenseObject | null> {
  const fields = pick(objectDataFields, args);
  const rows = await db('object').where('id', id).update(fields).returning(objectFields);
  return rows[0];
}

export async function deleteObject(db, id: ID): Promise<SenseObject | null> {
  const rows = db('object').where('id', id).delete().returning(objectFields);
  return rows[0];
}

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
    },
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
    },
  },
  Object: {
    id:          (o, _, context, info): ID     => o.id,
    createdAt:   (o, _, context, info): Date   => o.createdAt,
    updatedAt:   (o, _, context, info): Date   => o.updatedAt,
    x:           (o, _, context, info): number => o.x,
    y:           (o, _, context, info): number => o.y,
    zIndex:      (o, _, context, info): number => o.zIndex,
    mapId:       (o, _, context, info): number => o.mapId,
    objectType:  (o, _, context, info): number => o.objectType,
    cardId:      (o, _, context, info): number => o.cardId,
    boxId:       (o, _, context, info): number => o.boxId,
    belongsToId: (o, _, context, info): number => o.belongsToId,

    map:       async (o, _, { db }, info): Promise<Map>  => getMap(db, o.mapId),
    card:      async (o, _, { db }, info): Promise<Card> => getCard(db, o.cardId),
    box:       async (o, _, { db }, info): Promise<Box>  => getBox(db, o.boxId),
    belongsTo: async (o, _, { db }, info): Promise<Box>  => getBox(db, o.belongsToId),
  }
};
