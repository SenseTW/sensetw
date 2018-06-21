import { ID, Map, Card, Box, SenseObject, objectFields, objectDataFields } from './sql';
import { getMap, getObjectsInMap } from './map';
import { getCard } from './card';
import { getBox } from './box';
import { pick } from 'ramda';

export function objectsQuery(db) {
  const map = db.column('mapId').as('map');
  const box = db.column('boxId').as('box');
  const card = db.column('cardId').as('card');
  const belongsTo = db.column('belongsToId').as('belongsTo');
  return db.select([ ...objectFields, map, card, box, belongsTo ]).from('object');
}

export async function getAllObjects(db): Promise<SenseObject[]> {
  return objectsQuery(db);
}

export async function getObject(db, id: ID): Promise<SenseObject> {
  return objectsQuery(db).where('id', id);
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
    id:          (o, _, context, info): ID     => o.id || o,
    createdAt:   (o, _, context, info): Date   => o.createdAt,
    updatedAt:   (o, _, context, info): Date   => o.updatedAt,
    x:           (o, _, context, info): number => o.x,
    y:           (o, _, context, info): number => o.y,
    width:       (o, _, context, info): number => o.width,
    height:      (o, _, context, info): number => o.height,
    zIndex:      (o, _, context, info): number => o.zIndex,
    mapId:       (o, _, context, info): number => o.mapId,
    objectType:  (o, _, context, info): number => o.objectType,
    cardId:      (o, _, context, info): number => o.cardId,
    boxId:       (o, _, context, info): number => o.boxId,
    belongsToId: (o, _, context, info): number => o.belongsToId,

    map:       async (o, _, { db }, info): Promise<ID>  => o.map,
    card:      async (o, _, { db }, info): Promise<ID>  => o.card,
    box:       async (o, _, { db }, info): Promise<ID>  => o.box,
    belongsTo: async (o, _, { db }, info): Promise<ID>  => o.belongsTo,
  }
};
