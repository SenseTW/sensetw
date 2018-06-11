import { Dispatch, GetState } from '.';
import * as G from './graphql';
import * as GO from './graphql/object';
import * as GC from './graphql/card';
import * as GB from './graphql/box';
import * as GE from './graphql/edge';
import * as H from './sense/has-id';
import * as C from './sense/card';
import { CardID, CardData } from './sense/card';
import * as B from './sense/box';
import { BoxID, BoxData } from './sense/box';
import * as O from './sense/object';
import { ObjectType, ObjectID, ObjectData, objectData } from './sense/object';
import { Edge, EdgeID } from './sense/edge';
import * as S from './storage';
import { Storage } from './storage';
import { MapID } from './sense-map';
import { emptyAction } from './action';
import * as SL from './selection';
import * as SM from './sense-map';

export type State = Storage;

export const initial: State = S.initial;

const createCard =
  (mapId: MapID, card: CardData) =>
  async (dispatch: Dispatch) => {
    return GC.create(mapId, card)
      .then((newCard) => dispatch(S.updateCards(H.toIDMap<CardID, CardData>([
        newCard
      ]))));
  };

const updateCard =
  (card: CardData) =>
  (dispatch: Dispatch) => {
    return GC.update(card)
      .then((newCard) => dispatch(S.updateCards(H.toIDMap<CardID, CardData>([
        newCard
      ]))));
  };

const createBox =
  (mapId: MapID, box: BoxData) =>
  async (dispatch: Dispatch) => {
    return GB.create(mapId, box)
      .then((newBox) => dispatch(S.updateBoxes(H.toIDMap<BoxID, BoxData>([
        newBox
      ]))));
  };

const updateBox =
  (box: BoxData) =>
  (dispatch: Dispatch) => {
    return GB.update(box)
      .then((newBox) => dispatch(S.updateBoxes(H.toIDMap<BoxID, BoxData>([
        newBox
      ]))));
  };

const loadObjects =
  (id: MapID, overwrite: Boolean = false) =>
  (dispatch: Dispatch) => {
    return GO.loadObjects(id)
      .then(data => H.toIDMap<ObjectID, ObjectData>(data))
      .then(data => dispatch(overwrite ? S.overwriteObjects(data) : S.updateObjects(data)));
  };

const loadCards =
  (id: MapID, overwrite: Boolean = false) =>
  (dispatch: Dispatch) => {
    return GC.loadCards(id)
      .then(data => H.toIDMap<CardID, CardData>(data))
      .then(data => dispatch(overwrite ? S.overwriteCards(data) : S.updateCards(data)));
  };

const loadBoxes =
  (id: MapID, overwrite: Boolean = false) =>
  (dispatch: Dispatch) => {
    return GB.loadBoxes(id)
      .then(data => H.toIDMap<BoxID, BoxData>(data))
      .then(data => dispatch(overwrite ? S.overwriteBoxes(data) : S.updateBoxes(data)));
  };

const loadEdges =
  (id: MapID, overwrite: Boolean = false) =>
  (dispatch: Dispatch) => {
    return GE.load(id)
      .then(data => H.toIDMap<EdgeID, Edge>(data))
      .then(data => dispatch(overwrite ? S.overwriteEdges(data) : S.updateEdges(data)));
  };

const addCardToBox =
  (cardObject: ObjectID, box: BoxID) =>
  (dispatch: Dispatch) => {
    return G.addCardToBox(cardObject, box)
      .then(() => dispatch(S.updateInBox(cardObject, box)))
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
      .then((object) => dispatch(S.updateObjects(H.toIDMap<ObjectID, ObjectData>([
        object
      ]))));
  };

const createBoxObject =
  (mapId: MapID, box: BoxData) =>
  async (dispatch: Dispatch, getState: GetState) => {
    const action = await createBox(mapId, box)(dispatch);
    const { id = '' } = Object.values(action.payload.boxes)[0] || {};
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
    const { id = '' } = Object.values(action.payload.objects)[0] || {};
    if (box) {
      addCardToBox(id, box)(dispatch);
    }
    return action;
  };

const createCardObject =
  (mapId: MapID, card: CardData) =>
  async (dispatch: Dispatch, getState: GetState) => {
    const action = await createCard(mapId, card)(dispatch);
    const { id = '' } = Object.values(action.payload.cards)[0] || {};
    return createObjectForCard(mapId, id)(dispatch, getState);
  };

const moveObject =
  (id: ObjectID, x: number, y: number) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { senseObject } = getState();
    // compute the local object position
    const o = O.reducer(S.getObject(senseObject, id), O.updatePosition(x, y));
    return Promise.resolve(o)
      // optimistic update
      .then((object) => dispatch(S.updateObjects(H.toIDMap<ObjectID, ObjectData>([
        object
      ]))))
      // update the remote object
      .then(() => GO.move(id, x, y))
      // sync the local object
      .then((object) => dispatch(S.updateObjects(H.toIDMap<ObjectID, ObjectData>([
        object
      ]))));
  };

const removeCardFromBox =
  (cardObject: ObjectID, box: BoxID) =>
  (dispatch: Dispatch) => {
    return G.removeCardFromBox(cardObject, box)
      .then(() => dispatch(S.updateNotInBox(cardObject, box)))
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

const removeObject =
  (objectID: ObjectID) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { senseMap: { map } } = getState();
    return GO.remove(objectID)
      .then(() => dispatch(SL.actions.clearSelection()))
      .then(() => loadObjects(map, true)(dispatch))
      .then(() => loadCards(map, true)(dispatch))
      .then(() => loadBoxes(map, true)(dispatch));
  };

const removeCard =
  (cardID: CardID) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { senseMap: { map } } = getState();
    return GC.remove(cardID)
      .then(() => dispatch(SL.actions.clearSelection()))
      .then(() => loadCards(map, true)(dispatch))
      .then(() => loadObjects(map, true)(dispatch));
  };

const removeCardWithObject =
  (cardID: CardID) =>
  (dispatch: Dispatch, getState: GetState) => {
    return G.deleteObjectsByCard(cardID)
      .then(() => removeCard(cardID)(dispatch, getState));
  };

const removeBox =
  (boxID: BoxID) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { senseMap: { map } } = getState();
    return GB.remove(boxID)
      .then(() => dispatch(SL.actions.clearSelection()))
      .then(() => loadBoxes(map, true)(dispatch))
      .then(() => loadObjects(map, true)(dispatch));
  };

const removeBoxWithObject =
  (boxID: BoxID) =>
  (dispatch: Dispatch, getState: GetState) => {
    return G.deleteObjectsByBox(boxID)
      .then(() => removeBox(boxID)(dispatch, getState));
  };

const unboxCards =
  (boxID: BoxID) =>
  (dispatch: Dispatch, getState: GetState) => {
    return removeBoxWithObject(boxID)(dispatch, getState)
      .then(() => dispatch(SM.actions.setScopeToFullmap()));
  };

const createEdge =
  (map: MapID, from: ObjectID, to: ObjectID) =>
  (dispatch: Dispatch, getState: GetState) => {
    return GE.create(map, from, to)
      .then((edge) => dispatch(S.updateEdges(H.toIDMap<EdgeID, Edge>([ edge ]))));
  };

const removeEdge =
  (map: MapID, edge: EdgeID) =>
  (dispatch: Dispatch, getState: GetState) => {
    return GE.remove(edge)
      .then(() => loadEdges(map, true)(dispatch));
  };

export const actions = {
  updateCard,
  updateBox,
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
  removeObject,
  removeCardWithObject,
  removeBoxWithObject,
  removeEdge,
};

export type Action = S.Action;

export const reducer = (state: State = initial, action: S.Action = emptyAction): State => {
  switch (action.type) {
    case S.UPDATE_OBJECTS:
    case S.OVERWRITE_OBJECTS:
    case S.UPDATE_CARDS:
    case S.OVERWRITE_CARDS:
    case S.UPDATE_BOXES:
    case S.OVERWRITE_BOXES:
    case S.UPDATE_EDGES:
    case S.OVERWRITE_EDGES:
    case S.UPDATE_NOT_IN_BOX:
    case S.UPDATE_IN_BOX:
      return S.reducer(state, action);
    default: {
      return state;
    }
  }
};
