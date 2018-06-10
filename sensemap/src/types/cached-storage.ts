import { ActionUnion, emptyAction } from './action';
import * as S from './storage';
import { ObjectMap } from './sense/has-id';
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

export const doesObjectExist = (storage: CachedStorage, id: ObjectID): boolean =>
  S.doesObjectExist(storage[TargetType.TEMPORARY], id) || S.doesObjectExist(storage[TargetType.PERMANENT], id);

export const doesCardExist = (storage: CachedStorage, id: CardID): boolean =>
  S.doesCardExist(storage[TargetType.TEMPORARY], id) || S.doesCardExist(storage[TargetType.PERMANENT], id);

export const doesBoxExist = (storage: CachedStorage, id: BoxID): boolean =>
  S.doesBoxExist(storage[TargetType.TEMPORARY], id) || S.doesBoxExist(storage[TargetType.PERMANENT], id);

export const doesEdgeExist = (storage: CachedStorage, id: EdgeID): boolean =>
  S.doesEdgeExist(storage[TargetType.TEMPORARY], id) || S.doesEdgeExist(storage[TargetType.PERMANENT], id);

export const isObjectNew = (storage: CachedStorage, id: ObjectID): boolean =>
  S.doesObjectExist(storage[TargetType.TEMPORARY], id) && !S.doesObjectExist(storage[TargetType.PERMANENT], id);

export const isCardNew = (storage: CachedStorage, id: CardID): boolean =>
  S.doesCardExist(storage[TargetType.TEMPORARY], id) && !S.doesCardExist(storage[TargetType.PERMANENT], id);

export const isBoxNew = (storage: CachedStorage, id: BoxID): boolean =>
  S.doesBoxExist(storage[TargetType.TEMPORARY], id) && !S.doesBoxExist(storage[TargetType.PERMANENT], id);

export const isEdgeNew = (storage: CachedStorage, id: EdgeID): boolean =>
  S.doesEdgeExist(storage[TargetType.TEMPORARY], id) && !S.doesEdgeExist(storage[TargetType.PERMANENT], id);

export const isObjectDirty = (storage: CachedStorage, id: ObjectID): boolean =>
  S.doesObjectExist(storage[TargetType.TEMPORARY], id) && S.doesObjectExist(storage[TargetType.PERMANENT], id);

export const isCardDirty = (storage: CachedStorage, id: CardID): boolean =>
  S.doesCardExist(storage[TargetType.TEMPORARY], id) && S.doesCardExist(storage[TargetType.PERMANENT], id);

export const isBoxDirty = (storage: CachedStorage, id: BoxID): boolean =>
  S.doesBoxExist(storage[TargetType.TEMPORARY], id) && S.doesBoxExist(storage[TargetType.PERMANENT], id);

export const isEdgeDirty = (storage: CachedStorage, id: EdgeID): boolean =>
  S.doesEdgeExist(storage[TargetType.TEMPORARY], id) && S.doesEdgeExist(storage[TargetType.PERMANENT], id);

export const scoped = (storage: CachedStorage, filter: (key: ObjectID) => boolean): S.Storage =>
  S.scoped(toStorage(storage), filter);

// XXX: duplicated
export const scopedToBox = (storage: CachedStorage, id: BoxID): S.Storage => {
  const { contains } = getBox(storage, id);
  const filter = (key: ObjectID): boolean => !!contains[key];
  return scoped(storage, filter);
};

// XXX: duplicated
export const scopedToMap = (storage: CachedStorage): S.Storage => {
  const filter = (key: ObjectID): boolean => !getObject(storage, key).belongsTo;
  return scoped(storage, filter);
};

const updateObjects = (objects: ObjectMap<ObjectData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.UPDATE_OBJECTS as typeof S.UPDATE_OBJECTS,
  payload: { objects, target },
});

const overwriteObjects = (objects: ObjectMap<ObjectData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.OVERWRITE_OBJECTS as typeof S.OVERWRITE_OBJECTS,
  payload: { objects, target },
});

const removeObjects = (objects: ObjectMap<ObjectData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.REMOVE_OBJECTS as typeof S.REMOVE_OBJECTS,
  payload: { objects, target },
});

const updateCards = (cards: ObjectMap<CardData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.UPDATE_CARDS as typeof S.UPDATE_CARDS,
  payload: { cards, target },
});

const overwriteCards = (cards: ObjectMap<CardData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.OVERWRITE_CARDS as typeof S.OVERWRITE_CARDS,
  payload: { cards, target },
});

const removeCards = (cards: ObjectMap<CardData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.REMOVE_CARDS as typeof S.REMOVE_CARDS,
  payload: { cards, target },
});

const updateBoxes = (boxes: ObjectMap<BoxData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.UPDATE_BOXES as typeof S.UPDATE_BOXES,
  payload: { boxes, target },
});

const overwriteBoxes = (boxes: ObjectMap<BoxData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.OVERWRITE_BOXES as typeof S.OVERWRITE_BOXES,
  payload: { boxes, target },
});

const removeBoxes = (boxes: ObjectMap<BoxData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.REMOVE_BOXES as typeof S.REMOVE_BOXES,
  payload: { boxes, target },
});

const updateEdges = (edges: ObjectMap<Edge>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.UPDATE_EDGES as typeof S.UPDATE_EDGES,
  payload: { edges, target },
});

const overwriteEdges = (edges: ObjectMap<Edge>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.OVERWRITE_EDGES as typeof S.OVERWRITE_EDGES,
  payload: { edges, target },
});

const removeEdges = (edges: ObjectMap<Edge>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.REMOVE_EDGES as typeof S.REMOVE_EDGES,
  payload: { edges, target },
});

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

const FLUSH = 'FLUSH';
const flush = () => ({
  type: FLUSH as typeof FLUSH,
});

const FLUSH_OBJECTS = 'FLUSH_OBJECTS';
const flushObjects = () => ({
  type: FLUSH_OBJECTS as typeof FLUSH_OBJECTS,
});

const FLUSH_CARDS = 'FLUSH_CARDS';
const flushCards = () => ({
  type: FLUSH_CARDS as typeof FLUSH_CARDS,
});

const FLUSH_BOXES = 'FLUSH_BOXES';
const flushBoxes = () => ({
  type: FLUSH_BOXES as typeof FLUSH_BOXES,
});

const FLUSH_EDGES = 'FLUSH_EDGES';
const flushEdges = () => ({
  type: FLUSH_EDGES as typeof FLUSH_EDGES,
});

export const actions = {
  updateObjects,
  overwriteObjects,
  removeObjects,
  updateCards,
  overwriteCards,
  removeCards,
  updateBoxes,
  overwriteBoxes,
  removeBoxes,
  updateEdges,
  overwriteEdges,
  removeEdges,
  updateInBox,
  updateNotInBox,
  flush,
  flushObjects,
  flushCards,
  flushBoxes,
  flushEdges,
};

export type Action = ActionUnion<typeof actions>;

export const reducer = (state: CachedStorage = initial, action: Action = emptyAction): CachedStorage => {
  switch (action.type) {
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
    case FLUSH: {
      return {
        [TargetType.PERMANENT]: toStorage(state),
        [TargetType.TEMPORARY]: S.initial,
      };
    }
    case FLUSH_OBJECTS: {
      return {
        [TargetType.PERMANENT]: {
          ...state[TargetType.PERMANENT],
          objects: {
            ...state[TargetType.PERMANENT].objects,
            ...state[TargetType.TEMPORARY].objects,
          }
        },
        [TargetType.TEMPORARY]: S.initial,
      };
    }
    case FLUSH_CARDS: {
      return {
        [TargetType.PERMANENT]: {
          ...state[TargetType.PERMANENT],
          cards: {
            ...state[TargetType.PERMANENT].cards,
            ...state[TargetType.TEMPORARY].cards,
          }
        },
        [TargetType.TEMPORARY]: S.initial,
      };

    }
    case FLUSH_BOXES: {
      return {
        [TargetType.PERMANENT]: {
          ...state[TargetType.PERMANENT],
          boxes: {
            ...state[TargetType.PERMANENT].boxes,
            ...state[TargetType.TEMPORARY].boxes,
          }
        },
        [TargetType.TEMPORARY]: S.initial,
      };
    }
    case FLUSH_EDGES: {
      return {
        [TargetType.PERMANENT]: {
          ...state[TargetType.PERMANENT],
          edges: {
            ...state[TargetType.PERMANENT].edges,
            ...state[TargetType.TEMPORARY].edges,
          }
        },
        [TargetType.TEMPORARY]: S.initial,
      };
    }
    default: {
      return state;
    }
  }
};