import { Dispatch, GetState } from '.';
import * as G from './graphql';
import * as GM from './graphql/map';
import * as GO from './graphql/object';
import * as GC from './graphql/card';
import * as GB from './graphql/box';
import * as GE from './graphql/edge';
import * as H from './sense/has-id';
import * as C from './sense/card';
import { MapID, MapData } from './sense/map';
import { ObjectType, ObjectID, ObjectData, objectData } from './sense/object';
import { CardID, CardData } from './sense/card';
import * as B from './sense/box';
import { BoxID, BoxData } from './sense/box';
import { Edge, EdgeID } from './sense/edge';
import * as CS from './cached-storage';
import { TargetType, CachedStorage } from './cached-storage';
import * as SL from './selection';
import * as SM from './sense-map';

export type State = CachedStorage;

export const initial: State = CS.initial;

const createMap =
  (map: MapData) =>
  async (dispatch: Dispatch, getState: GetState) => {
    const { session: { user } } = getState();
    return GM.create(map, user)
      .then((newMap) => {
        // add the new map
        dispatch(CS.updateMaps(
          H.toIDMap<MapID, MapData>([newMap]),
          TargetType.PERMANENT,
        ));
        // remove the temporary map from the cached storage;
        dispatch(CS.removeMap(map));
      });
  };

const updateMap =
  (map: MapData) =>
  (dispatch: Dispatch) =>
    dispatch(CS.updateMaps(H.toIDMap<MapID, MapData>([map])));

const saveMap =
  (map: MapData) =>
  (dispatch: Dispatch) => {
    return GM.update(map)
      .then((newMap) => {
        const mapMap = H.toIDMap<MapID, MapData>([newMap]);
        // update the map
        dispatch(CS.updateMaps(mapMap, TargetType.PERMANENT));
        // remove the map from the cached storage
        dispatch(CS.removeMaps(mapMap));
      });
  };

const createCard =
  (mapId: MapID, card: CardData) =>
  async (dispatch: Dispatch, getState: GetState) => {
    const { session: { user } } = getState();
    return GC.create(mapId, card, user)
      .then((newCard) => dispatch(
        CS.updateCards(
          H.toIDMap<CardID, CardData>([newCard]),
          TargetType.PERMANENT,
        )
      ));
  };

const updateCard =
  (card: CardData) =>
  (dispatch: Dispatch) =>
    // edit the card cache
    dispatch(CS.updateCards(H.toIDMap<CardID, CardData>([card])));

const saveCard =
  (card: CardData) =>
  (dispatch: Dispatch) => {
    return GC.update(card)
      .then((newCard) => {
        const cardMap = H.toIDMap<CardID, CardData>([newCard]);
        // update the card
        dispatch(CS.updateCards(cardMap, TargetType.PERMANENT));
        // remove the card from the cache storage
        dispatch(CS.removeCards(cardMap));
      });
  };

const createBox =
  (mapId: MapID, box: BoxData) =>
  async (dispatch: Dispatch) => {
    return GB.create(mapId, box)
      .then((newBox) => dispatch(
        CS.updateBoxes(
          H.toIDMap<BoxID, BoxData>([newBox]),
          TargetType.PERMANENT,
        )
      ));
  };

const updateBox =
  (box: BoxData) =>
  (dispatch: Dispatch) =>
    // edit the box cache
    dispatch(CS.updateBoxes(H.toIDMap<BoxID, BoxData>([box])));

const saveBox =
  (box: BoxData) =>
  (dispatch: Dispatch) => {
    return GB.update(box)
      .then((newBox) => {
        const boxMap = H.toIDMap<BoxID, BoxData>([newBox]);
        // update the box
        dispatch(CS.updateBoxes(boxMap, TargetType.PERMANENT));
        // remove the box from the cache storage
        dispatch(CS.removeBoxes(boxMap));
      });
  };

const loadMaps =
  (overwrite: Boolean = false) =>
  (dispatch: Dispatch) => {
    return GM.loadMaps()
      .then(data => H.toIDMap<MapID, MapData>(data))
      .then(data => dispatch(
        overwrite
          ? CS.overwriteMaps(data, TargetType.PERMANENT)
          : CS.updateMaps(data, TargetType.PERMANENT)
      ));
  };

// TODO: fire less actions
const cleanUp =
  () =>
  (dispatch: Dispatch) => {
    dispatch(CS.overwriteObjects({}, TargetType.PERMANENT));
    dispatch(CS.overwriteCards({}, TargetType.PERMANENT));
    dispatch(CS.overwriteBoxes({}, TargetType.PERMANENT));
    dispatch(CS.overwriteEdges({}, TargetType.PERMANENT));
  };

const loadObjects =
  (id: MapID, overwrite: Boolean = false) =>
  (dispatch: Dispatch) => {
    return GO.loadObjects(id)
      .then(data => H.toIDMap<ObjectID, ObjectData>(data))
      .then(data => dispatch(
        overwrite
          ? CS.overwriteObjects(data, TargetType.PERMANENT)
          : CS.updateObjects(data, TargetType.PERMANENT)
      ));
  };

const loadCards =
  (id: MapID, overwrite: Boolean = false) =>
  (dispatch: Dispatch) => {
    return GC.loadCards(id)
      .then(data => H.toIDMap<CardID, CardData>(data))
      .then(data => dispatch(
        overwrite
          ? CS.overwriteCards(data, TargetType.PERMANENT)
          : CS.updateCards(data, TargetType.PERMANENT)
      ));
  };

const loadBoxes =
  (id: MapID, overwrite: Boolean = false) =>
  (dispatch: Dispatch) => {
    return GB.loadBoxes(id)
      .then(data => H.toIDMap<BoxID, BoxData>(data))
      .then(data => dispatch(
        overwrite
          ? CS.overwriteBoxes(data, TargetType.PERMANENT)
          : CS.updateBoxes(data, TargetType.PERMANENT)
      ));
  };

const loadEdges =
  (id: MapID, overwrite: Boolean = false) =>
  (dispatch: Dispatch) => {
    return GE.load(id)
      .then(data => H.toIDMap<EdgeID, Edge>(data))
      .then(data => dispatch(
        overwrite
          ? CS.overwriteEdges(data, TargetType.PERMANENT)
          : CS.updateEdges(data, TargetType.PERMANENT)
      ));
  };

const addCardToBox =
  (cardObject: ObjectID, box: BoxID) =>
  (dispatch: Dispatch) => {
    return G.addCardToBox(cardObject, box)
      .then(() => dispatch(CS.updateInBox(cardObject, box, TargetType.PERMANENT)))
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
      .then((object) => dispatch(
        CS.updateObjects(
          H.toIDMap<ObjectID, ObjectData>([object]),
          TargetType.PERMANENT,
        )
      ));
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
    const action = await createCard(mapId, card)(dispatch, getState);
    const { id = '' } = Object.values(action.payload.cards)[0] || {};
    return createObjectForCard(mapId, id)(dispatch, getState);
  };

const moveObject =
  (id: ObjectID, x: number, y: number) =>
  (dispatch: Dispatch) => {
    // update the remote object
    return GO.move(id, x, y)
      // sync the local object
      .then((object) => {
        const objectMap = H.toIDMap<ObjectID, ObjectData>([object]);
        // update the object
        dispatch(CS.updateObjects(objectMap, TargetType.PERMANENT));
        // remove the object from the cached storage
        dispatch(CS.removeObjects(objectMap));
      });
  };

const removeCardFromBox =
  (cardObject: ObjectID, box: BoxID) =>
  (dispatch: Dispatch) => {
    return G.removeCardFromBox(cardObject, box)
      .then(() => dispatch(CS.updateNotInBox(cardObject, box, TargetType.PERMANENT)))
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

const removeMap =
  (mapID: MapID) =>
  (dispatch: Dispatch) => {
    return GM.remove(mapID)
      .then(() => loadMaps(true)(dispatch));
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
      .then((edge) => dispatch(
        CS.updateEdges(
          H.toIDMap<EdgeID, Edge>([ edge ]),
          TargetType.PERMANENT,
        )
      ));
  };

const removeEdge =
  (map: MapID, edge: EdgeID) =>
  (dispatch: Dispatch, getState: GetState) => {
    return GE.remove(edge)
      .then(() => loadEdges(map, true)(dispatch));
  };

export const actions = {
  createMap,
  updateMap,
  saveMap,
  updateCard,
  saveCard,
  removeCard,
  updateBox,
  saveBox,
  removeBox,
  loadMaps,
  cleanUp,
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
  removeMap,
  removeObject,
  removeCardWithObject,
  removeBoxWithObject,
  removeEdge,
};

export type Action = CS.Action;

export const reducer = CS.reducer;
