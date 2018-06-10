import { ActionUnion, emptyAction } from './action';
import * as S from './storage';
import { ObjectMap } from './sense/has-id';
import { ObjectID, ObjectData, emptyObjectData } from './sense/object';
import { CardID, CardData, emptyCardData } from './sense/card';
import { BoxID, BoxData, emptyBoxData } from './sense/box';
import { EdgeID, Edge, emptyEdge } from './sense/edge';

/**
 * It is a storage with delayed updates.
 *
 * @todo Should model it with class-based OO?
 */
export type CachedStorage = {
  s: S.Storage,
  _: S.Storage,
};

export const initial = {
  s: S.initial,
  _: S.initial,
};

export const toStorage = (storage: CachedStorage): S.Storage => {
  return {
    objects: {
      ...storage.s.objects,
      ...storage._.objects,
    },
    cards: {
      ...storage.s.cards,
      ...storage._.cards,
    },
    boxes: {
      ...storage.s.boxes,
      ...storage._.boxes,
    },
    edges: {
      ...storage.s.edges,
      ...storage._.edges,
    },
  };
};

export const getObject =
  (storage: CachedStorage, id: ObjectID): ObjectData =>
  storage._.objects[id] || storage.s.objects[id] || emptyObjectData;

export const getCard =
  (storage: CachedStorage, id: CardID): CardData =>
  storage._.cards[id] || storage.s.cards[id] || emptyCardData;

export const getBox =
  (storage: CachedStorage, id: BoxID): BoxData =>
  storage._.boxes[id] || storage.s.boxes[id] || emptyBoxData;

export const getEdge =
  (storage: CachedStorage, id: EdgeID): Edge =>
  storage._.edges[id] || storage.s.edges[id] || emptyEdge;

// XXX: duplicated
export const getCardsInBox = (storage: CachedStorage, id: BoxID): ObjectMap<CardData> =>
  Object.keys(getBox(storage, id).contains)
    .map(oid => getObject(storage, oid).data )
    .map(cid => getCard(storage, cid))
    .reduce((a, c) => { a[c.id] = c; return a; }, {});

export const doesObjectExist = (storage: CachedStorage, id: ObjectID): boolean =>
  S.doesObjectExist(storage._, id) || S.doesObjectExist(storage.s, id);

export const doesCardExist = (storage: CachedStorage, id: CardID): boolean =>
  S.doesCardExist(storage._, id) || S.doesCardExist(storage.s, id);

export const doesBoxExist = (storage: CachedStorage, id: BoxID): boolean =>
  S.doesBoxExist(storage._, id) || S.doesBoxExist(storage.s, id);

export const doesEdgeExist = (storage: CachedStorage, id: EdgeID): boolean =>
  S.doesEdgeExist(storage._, id) || S.doesEdgeExist(storage.s, id);

export const isObjectNew = (storage: CachedStorage, id: ObjectID): boolean =>
  S.doesObjectExist(storage._, id) && !S.doesObjectExist(storage.s, id);

export const isCardNew = (storage: CachedStorage, id: CardID): boolean =>
  S.doesCardExist(storage._, id) && !S.doesCardExist(storage.s, id);

export const isBoxNew = (storage: CachedStorage, id: BoxID): boolean =>
  S.doesBoxExist(storage._, id) && !S.doesBoxExist(storage.s, id);

export const isEdgeNew = (storage: CachedStorage, id: EdgeID): boolean =>
  S.doesEdgeExist(storage._, id) && !S.doesEdgeExist(storage.s, id);

export const isObjectDirty = (storage: CachedStorage, id: ObjectID): boolean =>
  S.doesObjectExist(storage._, id) && S.doesObjectExist(storage.s, id);

export const isCardDirty = (storage: CachedStorage, id: CardID): boolean =>
  S.doesCardExist(storage._, id) && S.doesCardExist(storage.s, id);

export const isBoxDirty = (storage: CachedStorage, id: BoxID): boolean =>
  S.doesBoxExist(storage._, id) && S.doesBoxExist(storage.s, id);

export const isEdgeDirty = (storage: CachedStorage, id: EdgeID): boolean =>
  S.doesEdgeExist(storage._, id) && S.doesEdgeExist(storage.s, id);

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
  ...S.actions,
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
      return {
        s: state.s,
        _: S.reducer(state._, action),
      };
    }
    case FLUSH: {
      return {
        s: toStorage(state),
        _: S.initial,
      };
    }
    case FLUSH_OBJECTS: {
      return {
        s: {
          ...state.s,
          objects: {
            ...state.s.objects,
            ...state._.objects,
          }
        },
        _: S.initial,
      };
    }
    case FLUSH_CARDS: {
      return {
        s: {
          ...state.s,
          cards: {
            ...state.s.cards,
            ...state._.cards,
          }
        },
        _: S.initial,
      };

    }
    case FLUSH_BOXES: {
      return {
        s: {
          ...state.s,
          boxes: {
            ...state.s.boxes,
            ...state._.boxes,
          }
        },
        _: S.initial,
      };
    }
    case FLUSH_EDGES: {
      return {
        s: {
          ...state.s,
          edges: {
            ...state.s.edges,
            ...state._.edges,
          }
        },
        _: S.initial,
      };
    }
    default: {
      return state;
    }
  }
};