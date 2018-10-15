import { ActionUnion } from './action';
import { BoundingBox, emptyBoundingBox } from '../graphics/drawing';
import { ObjectID } from './sense/object';
import { BoxID } from './sense/box';
import { CardID } from './sense/card';
import { EdgeID } from './sense/edge';
import { findIndex, equals } from 'ramda';

/**
 * Appends something to a list if it's not in the list.
 *
 * @param x The thing
 * @param xs The list
 */
const append
  : <T>(x: T, xs: T[]) => T[]
  = (x, xs) => {
    const i = findIndex(equals(x), xs);
    return i === -1
      ? [...xs, x]
      : xs;
  };

/**
 * Removes something from a list if it's in the list.
 *
 * @param x The thing
 * @param xs The list
 */
const remove
  : <T>(x: T, xs: T[]) => T[]
  = (x, xs) => {
    const i = findIndex(equals(x), xs);
    return i === -1
      ? xs
      : [...xs.slice(0, i), ...xs.slice(i + 1)];
  };

// Selectable items in this application:
//   * map objects:
//     * boxes
//     * cards
//   * edges
//   * inbox cards
//
// The new selection structure should hold all of them.
// And map objects should be serialized to the query string.
const SELECT_MAP_BOX = 'SELECT_MAP_BOX';
const selectMapBox = (objectId: ObjectID, boxId: BoxID) => ({
  type: SELECT_MAP_BOX as typeof SELECT_MAP_BOX,
  payload: { objectId, boxId },
});

const UNSELECT_MAP_BOX = 'UNSELECT_MAP_BOX';
const unselectMapBox = (objectId: ObjectID, boxId: BoxID) => ({
  type: UNSELECT_MAP_BOX as typeof UNSELECT_MAP_BOX,
  payload: { objectId, boxId },
});

const SELECT_MAP_CARD = 'SELECT_MAP_CARD';
const selectMapCard = (objectId: ObjectID, cardId: CardID) => ({
  type: SELECT_MAP_CARD as typeof SELECT_MAP_CARD,
  payload: { objectId, cardId },
});

const UNSELECT_MAP_CARD = 'UNSELECT_MAP_CARD';
const unselectMapCard = (objectId: ObjectID, cardId: CardID) => ({
  type: UNSELECT_MAP_CARD as typeof UNSELECT_MAP_CARD,
  payload: { objectId, cardId },
});

const SELECT_MAP_EDGE = 'SELECT_MAP_EDGE';
const selectMapEdge = (edgeId: EdgeID) => ({
  type: SELECT_MAP_EDGE as typeof SELECT_MAP_EDGE,
  payload: { edgeId },
});

const UNSELECT_MAP_EDGE = 'UNSELECT_MAP_EDGE';
const unselectMapEdge = (edgeId: EdgeID) => ({
  type: UNSELECT_MAP_EDGE as typeof UNSELECT_MAP_EDGE,
  payload: { edgeId },
});

const SELECT_INBOX_CARD = 'SELECT_INBOX_CARD';
const selectInboxCard = (cardId: CardID) => ({
  type: SELECT_INBOX_CARD as typeof SELECT_INBOX_CARD,
  payload: { cardId },
});

const UNSELECT_INBOX_CARD = 'UNSELECT_INBOX_CARD';
const unselectInboxCard = (cardId: CardID) => ({
  type: UNSELECT_INBOX_CARD as typeof UNSELECT_INBOX_CARD,
  payload: { cardId },
});

const SET_BOUNDING_BOX = 'SET_BOUNDING_BOX';
const setBoundingBox = (boundingBox: BoundingBox) => ({
  type: SET_BOUNDING_BOX as typeof SET_BOUNDING_BOX,
  payload: { boundingBox },
});

const CLEAR_SELECTION = 'CLEAR_SELECTION';
const clearSelection = () => ({
  type: CLEAR_SELECTION as typeof CLEAR_SELECTION,
});

export const actions = {
  selectMapBox,
  unselectMapBox,
  selectMapCard,
  unselectMapCard,
  selectMapEdge,
  unselectMapEdge,
  selectInboxCard,
  unselectInboxCard,
  setBoundingBox,
  clearSelection,
};

export type Action = ActionUnion<typeof actions>;

export type State = {
  mapBoxes: { objectId: ObjectID, boxId: BoxID }[],
  mapCards: { objectId: ObjectID, cardId: CardID }[],
  mapEdges: EdgeID[],
  inboxCards: CardID[],
  boundingBox: BoundingBox,
};

export const initial: State = {
  mapBoxes: [],
  mapCards: [],
  mapEdges: [],
  inboxCards: [],
  boundingBox: emptyBoundingBox,
};

export const getObjectId = ({ objectId }: { objectId: ObjectID }) => objectId;

export const getBoxId = ({ boxId }: { boxId: BoxID }) => boxId;

export const selectedObjects = (selection: State): ObjectID[] =>
  [...selection.mapBoxes, ...selection.mapCards].map(getObjectId);

export const isMapObjectSelected = (selection: State, objectId: ObjectID): boolean =>
  findIndex((s) => s.objectId === objectId, selection.mapBoxes) !== -1 ||
  findIndex((s) => s.objectId === objectId, selection.mapCards) !== -1;

export const isMapBoxSelected = (selection: State, boxId: BoxID): boolean =>
  findIndex((s) => s.boxId === boxId, selection.mapBoxes) !== -1;

export const isMapCardSelected = (selection: State, cardId: CardID): boolean =>
  findIndex((s) => s.cardId === cardId, selection.mapCards) !== -1;

export const isMapEdgeSelected = (selection: State, edgeId: EdgeID): boolean =>
  findIndex((eid) => eid === edgeId, selection.mapEdges) !== -1;

export const isInboxCardSelected = (selection: State, cardId: CardID): boolean =>
  findIndex((cid) => cid === cardId, selection.inboxCards) !== -1;

export const reducer = (state: State = initial, action: Action): State => {
  switch (action.type) {
    case SELECT_MAP_BOX: {
      return {
        ...state,
        mapBoxes: append(action.payload, state.mapBoxes),
      };
    }
    case SELECT_MAP_CARD: {
      return {
        ...state,
        mapCards: append(action.payload, state.mapCards),
      };
    }
    case SELECT_MAP_EDGE: {
      const { edgeId } = action.payload;
      return {
        ...state,
        mapEdges: append(edgeId, state.mapEdges),
      };
    }
    case SELECT_INBOX_CARD: {
      const { cardId } = action.payload;
      return {
        ...state,
        inboxCards: append(cardId, state.inboxCards),
      };
    }
    case UNSELECT_MAP_BOX: {
      return {
        ...state,
        mapBoxes: remove(action.payload, state.mapBoxes),
      };
    }
    case UNSELECT_MAP_CARD: {
      return {
        ...state,
        mapCards: remove(action.payload, state.mapCards),
      };
    }
    case UNSELECT_MAP_EDGE: {
      const { edgeId } = action.payload;
      return {
        ...state,
        mapEdges: remove(edgeId, state.mapEdges),
      };
    }
    case UNSELECT_INBOX_CARD: {
      const { cardId } = action.payload;
      return {
        ...state,
        inboxCards: remove(cardId, state.inboxCards),
      };
    }
    case CLEAR_SELECTION: {
      return {
        ...state,
        mapBoxes: [],
        mapCards: [],
        mapEdges: [],
        inboxCards: [],
      };
    }
    default: {
      return state;
    }
  }
};
