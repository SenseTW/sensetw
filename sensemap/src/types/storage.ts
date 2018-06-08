import { ObjectMap } from './sense/has-id';
import { ObjectID, ObjectData, emptyObjectData } from './sense/object';
import { CardID, CardData, emptyCardData } from './sense/card';
import { BoxID, BoxData, emptyBoxData } from './sense/box';
import { EdgeID, Edge, emptyEdge } from './sense/edge';

/**
 * The storage of sense objects.
 */
export type Storage = {
  objects: ObjectMap<ObjectData>,
  cards:   ObjectMap<CardData>,
  boxes:   ObjectMap<BoxData>,
  edges:   ObjectMap<Edge>,
};

export const initial: Storage = {
  objects: {},
  cards:   {},
  boxes:   {},
  edges:   {},
};

/**
 * It gets an object by it's id.
 *
 * @param storage The storage.
 * @param id The object id.
 */
export const getObject = (storage: Storage, id: ObjectID): ObjectData => storage.objects[id] || emptyObjectData;

/**
 * It gets a card by it's id.
 *
 * @param storage The storage.
 * @param id The card id.
 */
export const getCard = (storage: Storage, id: CardID): CardData => storage.cards[id] || emptyCardData;

/**
 * It gets a box by it's id.
 *
 * @param storage The storage.
 * @param id The box id.
 */
export const getBox = (storage: Storage, id: BoxID): BoxData => storage.boxes[id] || emptyBoxData;

/**
 * It gets an edge by it's id.
 *
 * @param storage The storage.
 * @param id The edge id.
 */
export const getEdge = (storage: Storage, id: EdgeID): Edge => storage.edges[id] || emptyEdge;

/**
 * It gets cards from the given box.
 *
 * @param storage The storage.
 * @param id The box id.
 */
export const getCardsInBox = (storage: Storage, id: BoxID): ObjectMap<CardData> =>
  Object.keys(getBox(storage, id).contains)
    .map(oid => getObject(storage, oid).data )
    .map(cid => getCard(storage, cid))
    .reduce((a, c) => { a[c.id] = c; return a; }, {});

/**
 * Check if an object exists.
 *
 * @param storage The storage.
 * @param id The object id.
 */
export const doesObjectExist = (storage: Storage, id: ObjectID): boolean => !!storage.objects[id];

/**
 * Check if a card exists.
 *
 * @param storage The storage.
 * @param id The card id.
 */
export const doesCardExist = (storage: Storage, id: CardID): boolean => !!storage.cards[id];

/**
 * Check if a box exists.
 *
 * @param storage The storage.
 * @param id The card id.
 */
export const doesBoxExist = (storage: Storage, id: BoxID): boolean => !!storage.boxes[id];

/**
 * Check if an edge exists.
 *
 * @param storage The storage.
 * @param id The card id.
 */
export const doesEdgeExist = (storage: Storage, id: EdgeID): boolean => !!storage.edges[id];

/**
 * It gets a card from a storage or fallback to another storage.
 *
 * @param storage The target storage.
 * @param defaultStorage The fallback storage.
 * @param id The card id.
 */
export const getCardOrDefault = (storage: Storage, defaultStorage: Storage, id: CardID): CardData =>
  storage.cards[id] || defaultStorage.cards[id] || emptyCardData;

/**
 * It gets a box from a storage or fallback to another storage.
 *
 * @param storage The target storage.
 * @param defaultStorage The fallback storage.
 * @param id The box id.
 */
export const getBoxOrDefault = (storage: Storage, defaultStorage: Storage, id: BoxID): BoxData =>
  storage.boxes[id] || defaultStorage.boxes[id] || emptyBoxData;

/**
 * It gets an edge from a storage or fallback to another storage.
 *
 * @param storage The target storage.
 * @param defaultStorage The fallback storage.
 * @param id The edge id.
 */
export const getEdgeOrDefault = (storage: Storage, defaultStorage: Storage, id: EdgeID): Edge =>
  storage.edges[id] || defaultStorage.edges[id] || emptyEdge;

/**
 * It filters the storage objects and create a new storage with those objects
 * and their edges.
 *
 * @todo Is it a `map`?
 *
 * @param storage The target storage.
 * @param filter The filter function.
 */
export const scoped = (storage: Storage, filter: (key: ObjectID) => boolean): Storage => {
  const objects = Object.keys(storage.objects)
    .filter(filter)
    .reduce(
      (acc, key) => {
        acc[key] = getObject(storage, key);
        return acc;
      },
      {});
  const edges = Object.values(storage.edges)
    .filter(g => !!objects[g.from] && !!objects[g.to])
    .reduce(
      (acc, g) => {
        acc[g.id] = g;
        return acc;
      },
      {});
  const { cards, boxes } = storage;
  return { objects, cards, boxes, edges };
};

/**
 * It gets a substorage with objects inside a box.
 *
 * @param storage The target storage.
 * @param id The box id.
 */
export const scopedToBox = (storage: Storage, id: BoxID): Storage => {
  const { contains } = getBox(storage, id);
  const filter = (key: ObjectID): boolean => !!contains[key];
  return scoped(storage, filter);
};

/**
 * It gets a new storage with objects that are not in any box.
 *
 * @param storage The target storage.
 */
export const scopedToMap = (storage: Storage): Storage => {
  const filter = (key: ObjectID): boolean => !getObject(storage, key).belongsTo;
  return scoped(storage, filter);
};