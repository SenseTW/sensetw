import { ActionUnion, emptyAction } from './action';
import * as S from './storage';
import { ObjectMap, toIDMap } from './sense/has-id';
import { MapID, MapData, emptyMapData } from './sense/map';
import { ObjectID, ObjectData, emptyObjectData } from './sense/object';
import { CardID, CardData, emptyCardData } from './sense/card';
import { BoxID, BoxData, emptyBoxData } from './sense/box';
import { EdgeID, Edge, emptyEdge } from './sense/edge';

export enum TargetType {
  PERMANENT = 'PERMANENT',
  TEMPORARY = 'TEMPORARY',
}

/**
 * It is a storage with delayed updates.
 *
 * @todo Should model it with class-based OO?
 */
export type CachedStorage = {
  [TargetType.PERMANENT]: S.Storage,
  [TargetType.TEMPORARY]: S.Storage,
};

export const initial = {
  [TargetType.PERMANENT]: S.initial,
  [TargetType.TEMPORARY]: S.initial,
};

export const toStorage = (storage: CachedStorage): S.Storage => {
  return {
    maps: {
      ...storage[TargetType.PERMANENT].maps,
      ...storage[TargetType.TEMPORARY].maps,
    },
    objects: {
      ...storage[TargetType.PERMANENT].objects,
      ...storage[TargetType.TEMPORARY].objects,
    },
    cards: {
      ...storage[TargetType.PERMANENT].cards,
      ...storage[TargetType.TEMPORARY].cards,
    },
    boxes: {
      ...storage[TargetType.PERMANENT].boxes,
      ...storage[TargetType.TEMPORARY].boxes,
    },
    edges: {
      ...storage[TargetType.PERMANENT].edges,
      ...storage[TargetType.TEMPORARY].edges,
    },
  };
};

export const getMap =
  (storage: CachedStorage, id: MapID): MapData =>
  storage[TargetType.TEMPORARY].maps[id] || storage[TargetType.PERMANENT].maps[id] || emptyMapData;

export const getObject =
  (storage: CachedStorage, id: ObjectID): ObjectData =>
  storage[TargetType.TEMPORARY].objects[id] || storage[TargetType.PERMANENT].objects[id] || emptyObjectData;

export const getCard =
  (storage: CachedStorage, id: CardID): CardData =>
  storage[TargetType.TEMPORARY].cards[id] || storage[TargetType.PERMANENT].cards[id] || emptyCardData;

export const getBox =
  (storage: CachedStorage, id: BoxID): BoxData =>
  storage[TargetType.TEMPORARY].boxes[id] || storage[TargetType.PERMANENT].boxes[id] || emptyBoxData;

export const getEdge =
  (storage: CachedStorage, id: EdgeID): Edge =>
  storage[TargetType.TEMPORARY].edges[id] || storage[TargetType.PERMANENT].edges[id] || emptyEdge;

// XXX: duplicated
export const getCardsInBox = (storage: CachedStorage, id: BoxID): ObjectMap<CardData> =>
  Object.keys(getBox(storage, id).contains)
    .map(oid => getObject(storage, oid).data )
    .map(cid => getCard(storage, cid))
    .reduce((a, c) => { a[c.id] = c; return a; }, {});

export const doesMapExist = (storage: CachedStorage, id: MapID): boolean =>
  S.doesMapExist(storage[TargetType.TEMPORARY], id) || S.doesMapExist(storage[TargetType.PERMANENT], id);

export const doesObjectExist = (storage: CachedStorage, id: ObjectID): boolean =>
  S.doesObjectExist(storage[TargetType.TEMPORARY], id) || S.doesObjectExist(storage[TargetType.PERMANENT], id);

export const doesCardExist = (storage: CachedStorage, id: CardID): boolean =>
  S.doesCardExist(storage[TargetType.TEMPORARY], id) || S.doesCardExist(storage[TargetType.PERMANENT], id);

export const doesBoxExist = (storage: CachedStorage, id: BoxID): boolean =>
  S.doesBoxExist(storage[TargetType.TEMPORARY], id) || S.doesBoxExist(storage[TargetType.PERMANENT], id);

export const doesEdgeExist = (storage: CachedStorage, id: EdgeID): boolean =>
  S.doesEdgeExist(storage[TargetType.TEMPORARY], id) || S.doesEdgeExist(storage[TargetType.PERMANENT], id);

export const isMapNew = (storage: CachedStorage, id: MapID): boolean =>
  S.doesMapExist(storage[TargetType.TEMPORARY], id) && !S.doesMapExist(storage[TargetType.PERMANENT], id);

export const isObjectNew = (storage: CachedStorage, id: ObjectID): boolean =>
  S.doesObjectExist(storage[TargetType.TEMPORARY], id) && !S.doesObjectExist(storage[TargetType.PERMANENT], id);

export const isCardNew = (storage: CachedStorage, id: CardID): boolean =>
  S.doesCardExist(storage[TargetType.TEMPORARY], id) && !S.doesCardExist(storage[TargetType.PERMANENT], id);

export const isBoxNew = (storage: CachedStorage, id: BoxID): boolean =>
  S.doesBoxExist(storage[TargetType.TEMPORARY], id) && !S.doesBoxExist(storage[TargetType.PERMANENT], id);

export const isEdgeNew = (storage: CachedStorage, id: EdgeID): boolean =>
  S.doesEdgeExist(storage[TargetType.TEMPORARY], id) && !S.doesEdgeExist(storage[TargetType.PERMANENT], id);

export const isMapDirty = (storage: CachedStorage, id: MapID): boolean =>
  S.doesMapExist(storage[TargetType.TEMPORARY], id) && S.doesMapExist(storage[TargetType.PERMANENT], id);

export const isObjectDirty = (storage: CachedStorage, id: ObjectID): boolean =>
  S.doesObjectExist(storage[TargetType.TEMPORARY], id) && S.doesObjectExist(storage[TargetType.PERMANENT], id);

export const isCardDirty = (storage: CachedStorage, id: CardID): boolean =>
  S.doesCardExist(storage[TargetType.TEMPORARY], id) && S.doesCardExist(storage[TargetType.PERMANENT], id);

export const isBoxDirty = (storage: CachedStorage, id: BoxID): boolean =>
  S.doesBoxExist(storage[TargetType.TEMPORARY], id) && S.doesBoxExist(storage[TargetType.PERMANENT], id);

export const isEdgeDirty = (storage: CachedStorage, id: EdgeID): boolean =>
  S.doesEdgeExist(storage[TargetType.TEMPORARY], id) && S.doesEdgeExist(storage[TargetType.PERMANENT], id);

export const areMapsClean = (storage: CachedStorage): boolean => S.hasNoMap(storage[TargetType.TEMPORARY]);

export const areObjectsClean = (storage: CachedStorage): boolean => S.hasNoObject(storage[TargetType.TEMPORARY]);

export const areCardsClean = (storage: CachedStorage): boolean => S.hasNoCard(storage[TargetType.TEMPORARY]);

export const areBoxesClean = (storage: CachedStorage): boolean => S.hasNoBox(storage[TargetType.TEMPORARY]);

export const isClean = (storage: CachedStorage): boolean =>
  areMapsClean(storage) && areObjectsClean(storage) && areCardsClean(storage) && areBoxesClean(storage);

const submapByKeys = <T>(keys: string[], objmap: ObjectMap<T>): ObjectMap<T> =>
  keys.reduce((acc, key) => { acc[key] = objmap[key]; return acc; }, {});

/**
 * It scopes the cached storage and create a new diff for the scoped storage.
 *
 * @param storage The given cached storage.
 * @param filter The filter function.
 */
export const scoped = (storage: CachedStorage, filter: (key: ObjectID) => boolean): CachedStorage => {
  let result = {} as CachedStorage;

  // compute the scoped storage
  result[TargetType.PERMANENT] = S.scoped(storage[TargetType.PERMANENT], filter);

  // compute the scoped cached storage
  // the diff between the current storage and the next storage
  const diff = storage[TargetType.TEMPORARY];
  // get the next storage
  const next = toStorage(storage);
  // scoped next storage
  const part = S.scoped(next, filter);
  // create the diff of the scoped storage
  result[TargetType.TEMPORARY] = {
    maps:    submapByKeys(Object.keys(diff.maps), part.maps),
    objects: submapByKeys(Object.keys(diff.objects), part.objects),
    cards:   submapByKeys(Object.keys(diff.cards), part.cards),
    boxes:   submapByKeys(Object.keys(diff.boxes), part.boxes),
    edges:   submapByKeys(Object.keys(diff.edges), part.edges),
  };

  return result;
};

// XXX: duplicated
export const scopedToBox = (storage: CachedStorage, id: BoxID): CachedStorage => {
  const { contains } = getBox(storage, id);
  const filter = (key: ObjectID): boolean => !!contains[key];
  return scoped(storage, filter);
};

// XXX: duplicated
export const scopedToMap = (storage: CachedStorage): CachedStorage => {
  const filter = (key: ObjectID): boolean => !getObject(storage, key).belongsTo;
  return scoped(storage, filter);
};

export const updateMaps = (maps: ObjectMap<MapData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.UPDATE_MAPS as typeof S.UPDATE_MAPS,
  payload: { maps, target },
});

export const overwriteMaps = (maps: ObjectMap<MapData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.OVERWRITE_MAPS as typeof S.OVERWRITE_MAPS,
  payload: { maps, target },
});

export const removeMaps = (maps: ObjectMap<MapData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.REMOVE_MAPS as typeof S.REMOVE_MAPS,
  payload: { maps, target },
});

export const updateObjects = (objects: ObjectMap<ObjectData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.UPDATE_OBJECTS as typeof S.UPDATE_OBJECTS,
  payload: { objects, target },
});

export const overwriteObjects = (objects: ObjectMap<ObjectData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.OVERWRITE_OBJECTS as typeof S.OVERWRITE_OBJECTS,
  payload: { objects, target },
});

export const removeObjects = (objects: ObjectMap<ObjectData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.REMOVE_OBJECTS as typeof S.REMOVE_OBJECTS,
  payload: { objects, target },
});

export const removeObject = (object: ObjectData, target: TargetType = TargetType.TEMPORARY) =>
  removeObjects(toIDMap<ObjectID, ObjectData>([object]));

export const updateCards = (cards: ObjectMap<CardData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.UPDATE_CARDS as typeof S.UPDATE_CARDS,
  payload: { cards, target },
});

export const overwriteCards = (cards: ObjectMap<CardData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.OVERWRITE_CARDS as typeof S.OVERWRITE_CARDS,
  payload: { cards, target },
});

export const removeCards = (cards: ObjectMap<CardData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.REMOVE_CARDS as typeof S.REMOVE_CARDS,
  payload: { cards, target },
});

export const removeCard = (card: CardData, target: TargetType = TargetType.TEMPORARY) =>
  removeCards(toIDMap<CardID, CardData>([card]));

export const updateBoxes = (boxes: ObjectMap<BoxData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.UPDATE_BOXES as typeof S.UPDATE_BOXES,
  payload: { boxes, target },
});

export const overwriteBoxes = (boxes: ObjectMap<BoxData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.OVERWRITE_BOXES as typeof S.OVERWRITE_BOXES,
  payload: { boxes, target },
});

export const removeBoxes = (boxes: ObjectMap<BoxData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.REMOVE_BOXES as typeof S.REMOVE_BOXES,
  payload: { boxes, target },
});

export const removeBox = (box: BoxData, target: TargetType = TargetType.TEMPORARY) =>
  removeBoxes(toIDMap<BoxID, BoxData>([box]));

export const updateEdges = (edges: ObjectMap<Edge>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.UPDATE_EDGES as typeof S.UPDATE_EDGES,
  payload: { edges, target },
});

export const overwriteEdges = (edges: ObjectMap<Edge>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.OVERWRITE_EDGES as typeof S.OVERWRITE_EDGES,
  payload: { edges, target },
});

export const removeEdges = (edges: ObjectMap<Edge>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.REMOVE_EDGES as typeof S.REMOVE_EDGES,
  payload: { edges, target },
});

export const removeEdge = (edge: Edge, target: TargetType = TargetType.TEMPORARY) =>
  removeEdges(toIDMap<EdgeID, Edge>([edge]));

export const updateNotInBox =
  (cardObject: ObjectID, box: BoxID, target: TargetType = TargetType.TEMPORARY) => ({
    type: S.UPDATE_NOT_IN_BOX as typeof S.UPDATE_NOT_IN_BOX,
    payload: { cardObject, box, target },
  });

export const updateInBox =
  (cardObject: ObjectID, box: BoxID, target: TargetType = TargetType.TEMPORARY) => ({
    type: S.UPDATE_IN_BOX as typeof S.UPDATE_IN_BOX,
    payload: { cardObject, box, target },
  });

export const actions = {
  updateMaps,
  overwriteMaps,
  removeMaps,
  updateObjects,
  overwriteObjects,
  removeObjects,
  removeObject,
  updateCards,
  overwriteCards,
  removeCards,
  removeCard,
  updateBoxes,
  overwriteBoxes,
  removeBoxes,
  removeBox,
  updateEdges,
  overwriteEdges,
  removeEdges,
  removeEdge,
  updateInBox,
  updateNotInBox,
};

export type Action = ActionUnion<typeof actions>;

export const reducer = (state: CachedStorage = initial, action: Action = emptyAction): CachedStorage => {
  switch (action.type) {
    case S.UPDATE_MAPS:
    case S.OVERWRITE_MAPS:
    case S.REMOVE_MAPS:
    case S.UPDATE_OBJECTS:
    case S.OVERWRITE_OBJECTS:
    case S.REMOVE_OBJECTS:
    case S.UPDATE_CARDS:
    case S.OVERWRITE_CARDS:
    case S.REMOVE_CARDS:
    case S.UPDATE_BOXES:
    case S.OVERWRITE_BOXES:
    case S.REMOVE_BOXES:
    case S.UPDATE_EDGES:
    case S.OVERWRITE_EDGES:
    case S.REMOVE_EDGES:
    case S.UPDATE_NOT_IN_BOX:
    case S.UPDATE_IN_BOX: {
      const { target } = action.payload;

      return {
        ...state,
        [target]: S.reducer(state[target], action),
      };
    }
    default: {
      return state;
    }
  }
};