import { ID, Map, mapFields, SenseObject, objectFields, Card, Box, Edge } from './sql';
import { objectsQuery } from './object';
import { boxesQuery } from './box';
import { cardsQuery } from './card';
import { edgesQuery } from './edge';

export type MapFilter = {
  id?: ID;
};

type AllMapsArgs = {
  filter?: MapFilter;
};

export async function getMap(db, id: ID): Promise<Map | null> {
  const objects = db.raw('array(?) as objects', db.select('id').from('object').where('mapId', id));
  const cards = db.raw('array(?) as cards', db.select('id').from('card').where('mapId', id));
  const boxes = db.raw('array(?) as boxes', db.select('id').from('box').where('mapId', id));
  const edges = db.raw('array(?) as edges', db.select('id').from('edge').where('mapId', id));
  return db.select([...mapFields, objects, cards, boxes, edges]).from('map').where('id', id).first();
}

export async function getAllMaps(db): Promise<Map[]> {
  return db.select(mapFields).from('map');
}

export async function createMap(db, args: Map): Promise<Map> {
  const rows = await db('map').insert({}).returning(mapFields);
  return rows[0];
}

export async function deleteMap(db, id: ID): Promise<Map> {
  const rows = await db('map').where('id', id).delete().returning(mapFields);
  return rows[0];
}

export async function getObjectsInMap(db, mapId: ID): Promise<SenseObject[]> {
  return objectsQuery(db).where('mapId', mapId);
}

export async function getEdgesInMap(db, mapId: ID): Promise<Edge[]> {
  return edgesQuery(db).where('mapId', mapId);
}

export async function getCardsInMap(db, mapId: ID): Promise<Card[]> {
  return cardsQuery(db).where('mapId', mapId);
}

export async function getBoxesInMap(db, mapId: ID): Promise<Box[]> {
  return boxesQuery(db).where('mapId', mapId);
}

export const resolvers = {
  Query: {
    allMaps: async (_, args: AllMapsArgs, { db }, info): Promise<Map[]> => {
      if (args.filter) {
        return [ await getMap(db, args.filter.id) ];
      } else {
        return getAllMaps(db);
      }
    },

    Map: async (_, args, { db }, info): Promise<Map | null> => {
      return getMap(db, args.id);
    },
  },

  Mutation: {
    createMap: async (_, args, { db }, info): Promise<Map> => {
      return createMap(db, args);
    },

    deleteMap: async (_, args, { db }, info): Promise<Map> => {
      return deleteMap(db, args.id);
    },
  },

  Map: {
    id:        async (o, _, { db }, info): Promise<ID>            => typeof(o) !== 'string' ? o.id        : o,
    createdAt: async (o, _, { db }, info): Promise<Date>          => typeof(o) !== 'string' ? o.createdAt : (await getMap(db, o)).createdAt,
    updatedAt: async (o, _, { db }, info): Promise<Date>          => typeof(o) !== 'string' ? o.updatedAt : (await getMap(db, o)).updatedAt,
    objects:   async (o, _, { db }, info): Promise<SenseObject[]> => typeof(o) !== 'string' ? o.objects   : getObjectsInMap(db, o),
    edges:     async (o, _, { db }, info): Promise<Edge[]>        => typeof(o) !== 'string' ? o.edges     : getEdgesInMap(db, o),
    cards:     async (o, _, { db }, info): Promise<Card[]>        => typeof(o) !== 'string' ? o.cards     : getCardsInMap(db, o),
    boxes:     async (o, _, { db }, info): Promise<Box[]>         => typeof(o) !== 'string' ? o.boxes     : getBoxesInMap(db, o),
  },
};
