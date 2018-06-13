import { ID, Map, mapFields, SenseObject, Card, Box, Edge } from './sql';

export type MapFilter = {
  id?: ID;
};

type AllMapsArgs = {
  filter?: MapFilter;
};

export async function getMap(db, id: ID): Promise<Map | null> {
  return db.select(mapFields).from('map').where('id', id).first();
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
  return db.select('*').from('object').where('mapId', mapId);
}

export async function getEdgesInMap(db, mapId: ID): Promise<Edge[]> {
  return db.select('*').from('edge').where('mapId', mapId);
}

export async function getCardsInMap(db, mapId: ID): Promise<Card[]> {
  return db.select('*').from('card').where('mapId', mapId);
}

export async function getBoxesInMap(db, mapId: ID): Promise<Box[]> {
  return db.select('*').from('box').where('mapId', mapId);
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
    id:        (o, _, context, info): ID   => o.id,
    createdAt: (o, _, context, info): Date => o.createdAt,
    updatedAt: (o, _, context, info): Date => o.updatedAt,

    objects: async (o, _, { db }, info): Promise<SenseObject[]> => getObjectsInMap(db, o.id),
    edges:   async (o, _, { db }, info): Promise<Edge[]>        => getEdgesInMap(db, o.id),
    cards:   async (o, _, { db }, info): Promise<Card[]>        => getCardsInMap(db, o.id),
    boxes:   async (o, _, { db }, info): Promise<Box[]>         => getBoxesInMap(db, o.id),
  },
};
