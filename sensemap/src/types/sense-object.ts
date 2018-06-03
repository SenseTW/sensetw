import { Dispatch, GetState } from '.';
import * as G from './graphql';
import * as GO from './graphql/object';
import * as GC from './graphql/card';
import * as GB from './graphql/box';
import * as GE from './graphql/edge';
import * as H from './sense/has-id';
import * as C from './sense/card';
import { CardID, CardData, emptyCardData } from './sense/card';
import * as B from './sense/box';
import { BoxID, BoxData, emptyBoxData } from './sense/box';
import * as O from './sense/object';
import { ObjectType, ObjectID, ObjectData, emptyObjectData, objectData } from './sense/object';
import { Edge, EdgeID, emptyEdge } from './sense/edge';
import { MapID } from './sense-map';
import { ActionUnion, emptyAction } from './action';
import * as SL from './selection';
import * as SM from './sense-map';

export type State = {
  objects: { [key: string]: ObjectData },
  cards:   { [key: string]: CardData },
  boxes:   { [key: string]: BoxData },
  edges:   { [key: string]: Edge },
};

export const initial: State = {
  objects: {},
  cards:   {},
  boxes:   {},
  edges:   {},
};

export const getObject = (state: State, id: ObjectID): ObjectData => state.objects[id] || emptyObjectData;
export const getCard = (state: State, id: CardID): CardData => state.cards[id] || emptyCardData;
export const getBox = (state: State, id: BoxID): BoxData => state.boxes[id] || emptyBoxData;
export const getEdge = (state: State, id: EdgeID): Edge => state.edges[id] || emptyEdge;

export const getCardsInBox = (state: State, id: BoxID): State['cards'] =>
  Object.keys(getBox(state, id).contains)
    .map(oid => getObject(state, oid).data )
    .map(cid => getCard(state, cid))
    .reduce((a, c) => { a[c.id] = c; return a; }, {});

export const doesObjectExist = (state: State, id: ObjectID): boolean => !!state.objects[id];
export const doesCardExist = (state: State, id: CardID): boolean => !!state.cards[id];
export const doesBoxExist = (state: State, id: BoxID): boolean => !!state.boxes[id];
export const doesEdgeExist = (state: State, id: EdgeID): boolean => !!state.edges[id];

export const getCardOrDefault = (state: State, defaultState: State, id: CardID): CardData =>
  state.cards[id] || defaultState.cards[id] || emptyCardData;
export const getBoxOrDefault = (state: State, defaultState: State, id: BoxID): BoxData =>
  state.boxes[id] || defaultState.boxes[id] || emptyBoxData;
export const getEdgeOrDefault = (state: State, defaultState: State, id: EdgeID): Edge =>
  state.edges[id] || defaultState.edges[id] || emptyEdge;

export const scoped = (state: State, filter: (key: ObjectID) => boolean): State => {
  const objects = Object.keys(state.objects)
    .filter(filter)
    .reduce(
      (acc, key) => {
        acc[key] = getObject(state, key);
        return acc;
      },
      {});
  const edges = Object.values(state.edges)
    .filter(g => !!objects[g.from] && !!objects[g.to])
    .reduce(
      (acc, g) => {
        acc[g.id] = g;
        return acc;
      },
      {});
  const { cards, boxes } = state;
  return { objects, cards, boxes, edges };
};

export const scopedToBox = (state: State, id: BoxID): State => {
  const { contains } = getBox(state, id);
  const filter = (key: ObjectID): boolean => !!contains[key];
  return scoped(state, filter);
};

export const scopedToMap = (state: State): State => {
  const filter = (key: ObjectID): boolean => !getObject(state, key).belongsTo;
  return scoped(state, filter);
};

/**
 * Partially update `objects` state.
 */
const UPDATE_OBJECTS = 'UPDATE_OBJECTS';
const updateObjects =
  (objects: { [key: string]: ObjectData }) => ({
    type: UPDATE_OBJECTS as typeof UPDATE_OBJECTS,
    payload: objects,
  });

const OVERWRITE_OBJECTS = 'OVERWRITE_OBJECTS';
const overwriteObjects =
  (objects: { [key: string]: ObjectData }) => ({
    type: OVERWRITE_OBJECTS as typeof OVERWRITE_OBJECTS,
    payload: objects,
  });

/**
 * Partially update `cards` state.
 */
const UPDATE_CARDS = 'UPDATE_CARDS';
const updateCards =
  (cards: State['cards']) => ({
    type: UPDATE_CARDS as typeof UPDATE_CARDS,
    payload: cards,
  });

const OVERWRITE_CARDS = 'OVERWRITE_CARDS';
const overwriteCards =
  (cards: State['cards']) => ({
    type: OVERWRITE_CARDS as typeof OVERWRITE_CARDS,
    payload: cards,
  });

/**
 * Partially update `boxes` state.
 */
const UPDATE_BOXES = 'UPDATE_BOXES';
const updateBoxes =
  (boxes: State['boxes']) => ({
    type: UPDATE_BOXES as typeof UPDATE_BOXES,
    payload: boxes,
  });

const OVERWRITE_BOXES = 'OVERWRITE_BOXES';
const overwriteBoxes =
  (boxes: State['boxes']) => ({
    type: OVERWRITE_BOXES as typeof OVERWRITE_BOXES,
    payload: boxes,
  });

const UPDATE_EDGES = 'UPDATE_EDGES';
const updateEdges =
  (edges: State['edges']) => ({
    type: UPDATE_EDGES as typeof UPDATE_EDGES,
    payload: edges,
  });

const OVERWRITE_EDGES = 'OVERWRITE_EDGES';
const overwriteEdges =
  (edges: State['edges']) => ({
    type: OVERWRITE_EDGES as typeof OVERWRITE_EDGES,
    payload: edges,
  });

/**
 * Remove card from Box.contains bidirectional relation.
 */
const UPDATE_NOT_IN_BOX = 'UPDATE_NOT_IN_BOX';
const updateNotInBox =
  (cardObject: ObjectID, box: BoxID) => ({
    type: UPDATE_NOT_IN_BOX as typeof UPDATE_NOT_IN_BOX,
    payload: { cardObject, box }
  });

/**
 * Add card to Box.contains bidirectional relation.
 */
const UPDATE_IN_BOX = 'UPDATE_IN_BOX';
const updateInBox =
  (cardObject: ObjectID, box: BoxID) => ({
    type: UPDATE_IN_BOX as typeof UPDATE_IN_BOX,
    payload: { cardObject, box }
  });

const createCard =
  (mapId: MapID, card: CardData) =>
  async (dispatch: Dispatch) => {
    return GC.create(mapId, card)
      .then((newCard) => dispatch(updateCards(H.toIDMap<CardID, CardData>([
        newCard
      ]))));
  };

const updateRemoteCard =
  (card: CardData) =>
  (dispatch: Dispatch) => {
    return GC.update(card)
      .then((newCard) => dispatch(updateCards(H.toIDMap<CardID, CardData>([
        newCard
      ]))));
  };

const createBox =
  (mapId: MapID, box: BoxData) =>
  async (dispatch: Dispatch) => {
    return GB.create(mapId, box)
      .then((newBox) => dispatch(updateBoxes(H.toIDMap<BoxID, BoxData>([
        newBox
      ]))));
  };

const updateRemoteBox =
  (box: BoxData) =>
  (dispatch: Dispatch) => {
    return GB.update(box)
      .then((newBox) => dispatch(updateBoxes(H.toIDMap<BoxID, BoxData>([
        newBox
      ]))));
  };

const loadObjects =
  (id: MapID, overwrite: Boolean = false) =>
  (dispatch: Dispatch) => {
    return GO.loadObjects(id)
      .then(data => H.toIDMap<ObjectID, ObjectData>(data))
      .then(data => dispatch(overwrite ? overwriteObjects(data) : updateObjects(data)));
  };

const loadCards =
  (id: MapID, overwrite: Boolean = false) =>
  (dispatch: Dispatch) => {
    return GC.loadCards(id)
      .then(data => H.toIDMap<CardID, CardData>(data))
      .then(data => dispatch(overwrite ? overwriteCards(data) : updateCards(data)));
  };

const loadBoxes =
  (id: MapID, overwrite: Boolean = false) =>
  (dispatch: Dispatch) => {
    return GB.loadBoxes(id)
      .then(data => H.toIDMap<BoxID, BoxData>(data))
      .then(data => dispatch(overwrite ? overwriteBoxes(data) : updateBoxes(data)));
  };

const loadEdges =
  (id: MapID, overwrite: Boolean = false) =>
  (dispatch: Dispatch) => {
    return GE.load(id)
      .then(data => H.toIDMap<EdgeID, Edge>(data))
      .then(data => dispatch(overwrite ? overwriteEdges(data) : updateEdges(data)));
  };

const addCardToBox =
  (cardObject: ObjectID, box: BoxID) =>
  (dispatch: Dispatch) => {
    return G.addCardToBox(cardObject, box)
      .then(() => dispatch(updateInBox(cardObject, box)))
      .then(() => dispatch(SL.actions.clearSelection()));
  };

const addCardsToBox =
  (cardObjects: ObjectID[], box: BoxID) =>
  async (dispatch: Dispatch) => {
    await Promise.all(
      cardObjects.map(id => addCardToBox(id, box)(dispatch))
    );
    return dispatch(SL.actions.clearSelection());
  };

const createObject =
  (mapId: MapID, data: ObjectData) =>
  (dispatch: Dispatch) => {
    return GO.create(mapId, data)
      .then((object) => dispatch(updateObjects(H.toIDMap<ObjectID, ObjectData>([
        object
      ]))));
  };

const createBoxObject =
  (mapId: MapID, box: BoxData) =>
  async (dispatch: Dispatch, getState: GetState) => {
    const action = await createBox(mapId, box)(dispatch);
    const { id = '' } = Object.values(action.payload)[0] || {};
    const { viewport: { width, height, top, left } } = getState();
    const x = left + (width - B.DEFAULT_WIDTH) / 2;
    const y = top + (height - B.DEFAULT_HEIGHT) / 2;
    return createObject(
      mapId,
      objectData({
        x, y,
        objectType: ObjectType.BOX,
        data: id,
      })
    )(dispatch);
  };

const createObjectForCard =
  (mapId: MapID, cardId: CardID, box?: BoxID) =>
  async (dispatch: Dispatch, getState: GetState) => {
    const { viewport: { width, height, top, left } } = getState();
    const x = left + (width - C.DEFAULT_WIDTH) / 2;
    const y = top + (height - C.DEFAULT_HEIGHT) / 2;
    const action = await createObject(
      mapId,
      objectData({
        x, y,
        objectType: ObjectType.CARD,
        data: cardId,
      })
    )(dispatch);
    const { id = '' } = Object.values(action.payload)[0] || {};
    if (box) {
      addCardToBox(id, box)(dispatch);
    }
    return action;
  };

const createCardObject =
  (mapId: MapID, card: CardData) =>
  async (dispatch: Dispatch, getState: GetState) => {
    const action = await createCard(mapId, card)(dispatch);
    const { id = '' } = Object.values(action.payload)[0] || {};
    return createObjectForCard(mapId, id)(dispatch, getState);
  };

const moveObject =
  (id: ObjectID, x: number, y: number) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { senseObject } = getState();
    // compute the local object position
    const o = O.reducer(getObject(senseObject, id), O.updatePosition(x, y));
    return Promise.resolve(o)
      // optimistic update
      .then((object) => dispatch(updateObjects(H.toIDMap<ObjectID, ObjectData>([
        object
      ]))))
      // update the remote object
      .then(() => GO.move(id, x, y))
      // sync the local object
      .then((object) => dispatch(updateObjects(H.toIDMap<ObjectID, ObjectData>([
        object
      ]))));
  };

const removeCardFromBox =
  (cardObject: ObjectID, box: BoxID) =>
  (dispatch: Dispatch) => {
    return G.removeCardFromBox(cardObject, box)
      .then(() => dispatch(updateNotInBox(cardObject, box)))
      .then(() => dispatch(SL.actions.clearSelection()));
  };

const removeCardsFromBox =
  (cardObjects: ObjectID[], box: BoxID) =>
  async (dispatch: Dispatch) => {
    await Promise.all(
      cardObjects.map(id => removeCardFromBox(id, box)(dispatch))
    );
    return dispatch(SL.actions.clearSelection());
  };

const deleteObject =
  (objectID: ObjectID) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { senseMap: { map } } = getState();
    return GO.remove(objectID)
      .then(() => dispatch(SL.actions.clearSelection()))
      .then(() => loadObjects(map, true)(dispatch))
      .then(() => loadCards(map, true)(dispatch))
      .then(() => loadBoxes(map, true)(dispatch));
  };

const deleteCard =
  (cardID: CardID) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { senseMap: { map } } = getState();
    return GC.remove(cardID)
      .then(() => dispatch(SL.actions.clearSelection()))
      .then(() => loadCards(map, true)(dispatch))
      .then(() => loadObjects(map, true)(dispatch));
  };

const deleteCardWithObject =
  (cardID: CardID) =>
  (dispatch: Dispatch, getState: GetState) => {
    return G.deleteObjectsByCard(cardID)
      .then(() => deleteCard(cardID)(dispatch, getState));
  };

const deleteBox =
  (boxID: BoxID) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { senseMap: { map } } = getState();
    return GB.remove(boxID)
      .then(() => dispatch(SL.actions.clearSelection()))
      .then(() => loadBoxes(map, true)(dispatch))
      .then(() => loadObjects(map, true)(dispatch));
  };

const deleteBoxWithObject =
  (boxID: BoxID) =>
  (dispatch: Dispatch, getState: GetState) => {
    return G.deleteObjectsByBox(boxID)
      .then(() => deleteBox(boxID)(dispatch, getState));
  };

const unboxCards =
  (boxID: BoxID) =>
  (dispatch: Dispatch, getState: GetState) => {
    return deleteBoxWithObject(boxID)(dispatch, getState)
      .then(() => dispatch(SM.actions.setScopeToFullmap()));
  };

const createEdge =
  (map: MapID, from: ObjectID, to: ObjectID) =>
  (dispatch: Dispatch, getState: GetState) => {
    return GE.create(map, from, to)
      .then((edge) => dispatch(updateEdges(H.toIDMap<EdgeID, Edge>([ edge ]))));
  };

const deleteEdge =
  (map: MapID, edge: EdgeID) =>
  (dispatch: Dispatch, getState: GetState) => {
    return GE.remove(edge)
      .then(() => loadEdges(map, true)(dispatch));
  };

export const syncActions = {
  updateObjects,
  overwriteObjects,
  updateCards,
  overwriteCards,
  updateBoxes,
  overwriteBoxes,
  updateEdges,
  overwriteEdges,
  updateNotInBox,
  updateInBox,
};

export const actions = {
  ...syncActions,
  updateRemoteCard,
  updateRemoteBox,
  loadObjects,
  loadCards,
  loadBoxes,
  loadEdges,
  createCard,
  createBoxObject,
  createObjectForCard,
  createCardObject,
  createEdge,
  moveObject,
  addCardToBox,
  addCardsToBox,
  removeCardFromBox,
  removeCardsFromBox,
  unboxCards,
  deleteObject,
  deleteCardWithObject,
  deleteBoxWithObject,
  deleteEdge,
};

export type Action = ActionUnion<typeof syncActions>;

export const reducer = (state: State = initial, action: Action = emptyAction): State => {
  switch (action.type) {
    case UPDATE_OBJECTS: {
      return {
        ...state,
        objects: { ...state.objects, ...action.payload },
      };
    }
    case OVERWRITE_OBJECTS: {
      return {
        ...state,
        objects: action.payload,
      };
    }
    case UPDATE_CARDS: {
      return {
        ...state,
        cards: { ...state.cards, ...action.payload },
      };
    }
    case OVERWRITE_CARDS: {
      return {
        ...state,
        cards: action.payload,
      };
    }
    case UPDATE_BOXES: {
      return {
        ...state,
        boxes: { ...state.boxes, ...action.payload },
      };
    }
    case OVERWRITE_BOXES: {
      return {
        ...state,
        boxes: action.payload,
      };
    }
    case UPDATE_EDGES: {
      return { ...state, edges: { ...state.edges, ...action.payload } };
    }
    case OVERWRITE_EDGES: {
      return { ...state, edges: action.payload };
    }
    case UPDATE_NOT_IN_BOX: {
      const box        = state.boxes[action.payload.box];
      const cardObject = state.objects[action.payload.cardObject];
      let { contains } = box;
      delete(contains[cardObject.id]);
      return {
        ...state,
        boxes: {
          ...state.boxes,
          [box.id]: { ...box, contains },
        },
        objects: {
          ...state.objects,
          [cardObject.id]: { ...cardObject, belongsTo: undefined },
        }
      };
    }
    case UPDATE_IN_BOX: {
      const box        = state.boxes[action.payload.box];
      const cardObject = state.objects[action.payload.cardObject];
      const contains   = {
        ...box.contains,
        [cardObject.id]: { id: cardObject.id },
      };
      return {
        ...state,
        boxes: {
          ...state.boxes,
          [box.id]: { ...box, contains },
        },
        objects: {
          ...state.objects,
          [cardObject.id]: { ...cardObject, belongsTo: box.id },
        },
      };
    }
    default: {
      return state;
    }
  }
};
