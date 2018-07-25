import { pick } from 'ramda';
import { ID, Map, mapFields, mapDataFields, SenseObject, objectFields, Card, Box, Edge } from './sql';
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

export function mapsQuery(db) {
  return db.select(mapFields(db)).from('map');
}

export async function getMap(db, id: ID): Promise<Map | null> {
  const m = await mapsQuery(db).where('id', id).first();
  return m === undefined ? null : m;
}

export async function getAllMaps(db): Promise<Map[]> {
  return mapsQuery(db);
}

export async function createMap(db, args: Map): Promise<Map> {
  const fields = pick(mapDataFields, args);
  const rows = await db('map').insert(fields).returning(mapFields(db));
  return rows[0];
}

export async function updateMap(db, id: ID, args): Promise<Map> {
  const fields = pick(mapDataFields, args);
  const rows = await db('map').where('id', id).update(fields).returning(mapFields(db));
  return rows[0];
}

export async function deleteMap(db, id: ID): Promise<Map> {
  const rows = await db('map').where('id', id).del().returning(mapFields(db));
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

function getValue(db, o, key, query) {
  if (typeof(o) === 'string') {
    return query(db, o);
  } else if (key in o) {
    return o[key];
  } else {
    return query(db, o.id);
  }
}

export const resolvers = {
  Query: {
    allMaps: async (_, args: AllMapsArgs, { db }, info): Promise<Map[]> => {
      if (args.filter) {
        const m = await getMap(db, args.filter.id);
        return !!m ? [ m ] : [];
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

    updateMap: async (_, args, { db }, info): Promise<Map> => {
      return updateMap(db, args.id, args);
    },

    deleteMap: async (_, args, { db }, info): Promise<Map> => {
      return deleteMap(db, args.id);
    },
  },

  Map: {
    id:          async (o, _, { db }, info): Promise<ID>            => typeof(o) !== 'string' ? o.id          : o,
    createdAt:   async (o, _, { db }, info): Promise<Date>          => typeof(o) !== 'string' ? o.createdAt   : (await getMap(db, o)).createdAt,
    updatedAt:   async (o, _, { db }, info): Promise<Date>          => typeof(o) !== 'string' ? o.updatedAt   : (await getMap(db, o)).updatedAt,
    name:        async (o, _, { db }, info): Promise<string>        => typeof(o) !== 'string' ? o.name        : (await getMap(db, o)).name,
    description: async (o, _, { db }, info): Promise<string>        => typeof(o) !== 'string' ? o.description : (await getMap(db, o)).description,
    tags:        async (o, _, { db }, info): Promise<string>        => typeof(o) !== 'string' ? o.tags        : (await getMap(db, o)).tags,
    image:       async (o, _, { db }, info): Promise<string>        => typeof(o) !== 'string' ? o.image       : (await getMap(db, o)).image,
    type:        async (o, _, { db }, info): Promise<string>        => typeof(o) !== 'string' ? o.type        : (await getMap(db, o)).type,
    objects:     async (o, _, { db }, info): Promise<SenseObject[]> => typeof(o) !== 'string' ? o.objects     : getObjectsInMap(db, o),
    edges:       async (o, _, { db }, info): Promise<Edge[]>        => typeof(o) !== 'string' ? o.edges       : getEdgesInMap(db, o),
    cards:       async (o, _, { db }, info): Promise<Card[]>        => typeof(o) !== 'string' ? o.cards       : getCardsInMap(db, o),
    boxes:       async (o, _, { db }, info): Promise<Box[]>         => typeof(o) !== 'string' ? o.boxes       : getBoxesInMap(db, o),
  },
};
