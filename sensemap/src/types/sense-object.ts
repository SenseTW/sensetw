import { Dispatch, GetState } from '.';
import * as G from './graphql';
import * as GM from './graphql/map';
import * as GO from './graphql/object';
import * as GC from './graphql/card';
import * as GB from './graphql/box';
import * as GE from './graphql/edge';
import * as GH from './graphql/history';
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
import * as U from './utils';

export type State = CachedStorage;

export const initial: State = CS.initial;

const createMap =
  (map: MapData) =>
  async (dispatch: Dispatch, getState: GetState) => {
    const { session: { user } } = getState();
    return GM.create(user, map)
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
  (dispatch: Dispatch, getState: GetState) => {
    const { session: { user } } = getState();
    return GM.update(user, map)
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
    return GC.create(user, mapId, card)
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
  (dispatch: Dispatch, getState: GetState) => {
    const { session: { user } } = getState();
    return GC.update(user, card)
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
  async (dispatch: Dispatch, getState: GetState) => {
    const { session: { user } } = getState();
    return GB.create(user, mapId, box)
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
  (dispatch: Dispatch, getState: GetState) => {
    const { session: { user } } = getState();
    return GB.update(user, box)
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
  (dispatch: Dispatch, getState: GetState) => {
    const { session: { user } } = getState();
    return GM.loadMaps(user)
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
  (id: MapID, overwrite: boolean = false) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { session: { user } } = getState();
    return GO.loadObjects(user, id)
      .then(data => H.toIDMap<ObjectID, ObjectData>(data))
      .then(data => dispatch(
        overwrite
          ? CS.overwriteObjects(data, TargetType.PERMANENT)
          : CS.updateObjects(data, TargetType.PERMANENT)
      ));
  };

const loadObjectsById =
  (ids: ObjectID[], overwrite: boolean = false) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { session: { user } } = getState();
    return GO.loadObjectsById(user, ids)
      .then(data => H.toIDMap<ObjectID, ObjectData>(data))
      .then(data => dispatch(
        overwrite
          ? CS.overwriteObjects(data, TargetType.PERMANENT)
          : CS.updateObjects(data, TargetType.PERMANENT)
      ));
  };

const loadCards =
  (id: MapID, overwrite: Boolean = false) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { session: { user } } = getState();
    return GC.loadCards(user, id)
      .then(data => H.toIDMap<CardID, CardData>(data))
      .then(data => dispatch(
        overwrite
          ? CS.overwriteCards(data, TargetType.PERMANENT)
          : CS.updateCards(data, TargetType.PERMANENT)
      ));
  };

const loadCardsById =
  (ids: CardID[], overwrite: boolean = false) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { session: { user } } = getState();
    return GC.loadCardsById(user, ids)
      .then(data => H.toIDMap<CardID, CardData>(data))
      .then(data => dispatch(
        overwrite
          ? CS.overwriteCards(data, TargetType.PERMANENT)
          : CS.updateCards(data, TargetType.PERMANENT)
      ));
  };

const loadBoxes =
  (id: MapID, overwrite: Boolean = false) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { session: { user } } = getState();
    return GB.loadBoxes(user, id)
      .then(data => H.toIDMap<BoxID, BoxData>(data))
      .then(data => dispatch(
        overwrite
          ? CS.overwriteBoxes(data, TargetType.PERMANENT)
          : CS.updateBoxes(data, TargetType.PERMANENT)
      ));
  };

const loadBoxesById =
  (ids: BoxID[], overwrite: boolean = false) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { session: { user } } = getState();
    return GB.loadBoxesById(user, ids)
      .then(data => H.toIDMap<BoxID, BoxData>(data))
      .then(data => dispatch(
        overwrite
          ? CS.overwriteBoxes(data, TargetType.PERMANENT)
          : CS.updateBoxes(data, TargetType.PERMANENT)
      ));
  };

const loadEdges =
  (id: MapID, overwrite: Boolean = false) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { session: { user } } = getState();
    return GE.load(user, id)
      .then(data => H.toIDMap<EdgeID, Edge>(data))
      .then(data => dispatch(
        overwrite
          ? CS.overwriteEdges(data, TargetType.PERMANENT)
          : CS.updateEdges(data, TargetType.PERMANENT)
      ));
  };

const loadEdgesById =
  (ids: BoxID[], overwrite: boolean = false) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { session: { user } } = getState();
    return GE.loadById(user, ids)
      .then(data => H.toIDMap<EdgeID, Edge>(data))
      .then(data => dispatch(
        overwrite
          ? CS.overwriteEdges(data, TargetType.PERMANENT)
          : CS.updateEdges(data, TargetType.PERMANENT)
      ));
  };

const loadHistories =
  () =>
  (dispatch: Dispatch, getState: GetState) => {
    const { session: { user } } = getState();
    return GH.loadAll(user);
  };

const diff = (before: string[], after: string[]) => {
  let removed = [];
  let beforeMap = {};
  let afterMap = {};
  for (const str of before) {
    beforeMap[str] = true;
  }
  for (const str of after) {
    afterMap[str] = true;
  }
  for (const str of before) {
    if (!afterMap[str]) {
      removed.push(str);
    }
  }
  return removed;
};

const toIDObj = <T extends string>(id: T) => ({ id });

const update =
  (overwrite: boolean) =>
  async (dispatch: Dispatch, getState: GetState) => {
    const { session: { user }, senseMap: { map: mid }, senseObject: s } = getState();
    if (!mid) { return []; }
    // get old ids
    const oldObjects = CS.getObjectIds(s, TargetType.PERMANENT);
    const oldCards = CS.getCardIds(s, TargetType.PERMANENT);
    const oldBoxes = CS.getBoxIds(s, TargetType.PERMANENT);
    const oldEdges = CS.getEdgeIds(s, TargetType.PERMANENT);
    // await for new ids
    const [newObjects, newCards, newBoxes, newEdges] = await Promise.all([
      GO.loadObjectIds(user, mid),
      GC.loadCardIds(user, mid),
      GB.loadBoxIds(user, mid),
      GE.loadIds(user, mid),
    ]);
    // diff them all
    const removedObjects = diff(oldObjects, newObjects);
    const removedCards = diff(oldCards, newCards);
    const removedBoxes = diff(oldBoxes, newBoxes);
    const removedEdges = diff(oldEdges, newEdges);
    // remove disappeared ids
    // TODO: unselect them
    // TODO: add `removeSomethingByIds`
    if (removedObjects) {
      const idMap = H.toIDMap<ObjectID, H.HasID<ObjectID>>(removedObjects.map(toIDObj));
      dispatch(CS.removeObjects(idMap));
    }
    if (removedCards) {
      const idMap = H.toIDMap<CardID, H.HasID<CardID>>(removedCards.map(toIDObj));
      dispatch(CS.removeCards(idMap));
    }
    if (removedBoxes) {
      const idMap = H.toIDMap<BoxID, H.HasID<BoxID>>(removedBoxes.map(toIDObj));
      dispatch(CS.removeBoxes(idMap));
    }
    if (removedEdges) {
      const idMap = H.toIDMap<EdgeID, H.HasID<EdgeID>>(removedEdges.map(toIDObj));
      dispatch(CS.removeEdges(idMap));
    }
    // update other ids
    return Promise.all([
      loadObjectsById(newObjects, true)(dispatch, getState),
      loadCardsById(newCards, true)(dispatch, getState),
      loadBoxesById(newBoxes, true)(dispatch, getState),
      loadEdgesById(newEdges, true)(dispatch, getState),
    ]);
  };

const keepUpdating =
  (overwrite: boolean) =>
  // tslint:disable-next-line:no-any
  (dispatch: Dispatch, getState: GetState): Promise<any> =>
    update(overwrite)(dispatch, getState)
      .catch(U.error)
      .then(U.delay(5000))
      .then(() => keepUpdating(overwrite)(dispatch, getState));

const addCardToBox =
  (cardObject: ObjectID, box: BoxID) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { session: { user } } = getState();
    return G.addCardToBox(user, cardObject, box)
      .then(() => dispatch(CS.updateInBox(cardObject, box, TargetType.PERMANENT)))
      .then(() => dispatch(SL.actions.clearSelection()));
  };

const addCardsToBox =
  (cardObjects: ObjectID[], box: BoxID) =>
  async (dispatch: Dispatch, getState: GetState) => {
    await Promise.all(
      cardObjects.map(id => addCardToBox(id, box)(dispatch, getState))
    );
    return dispatch(SL.actions.clearSelection());
  };

const createObject =
  (mapId: MapID, data: ObjectData) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { session: { user } } = getState();
    return GO.create(user, mapId, data)
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
    const action = await createBox(mapId, box)(dispatch, getState);
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
    )(dispatch, getState);
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
    )(dispatch, getState);
    const { id = '' } = Object.values(action.payload.objects)[0] || {};
    if (box) {
      addCardToBox(id, box)(dispatch, getState);
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
  (dispatch: Dispatch, getState: GetState) => {
    const { session: { user } } = getState();
    // update the remote object
    return GO.move(user, id, x, y)
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
  (dispatch: Dispatch, getState: GetState) => {
    const { session: { user } } = getState();
    return G.removeCardFromBox(user, cardObject, box)
      .then(() => dispatch(CS.updateNotInBox(cardObject, box, TargetType.PERMANENT)))
      .then(() => dispatch(SL.actions.clearSelection()));
  };

const removeCardsFromBox =
  (cardObjects: ObjectID[], box: BoxID) =>
  async (dispatch: Dispatch, getState: GetState) => {
    const { session: { user } } = getState();
    await Promise.all(cardObjects.map(
      id => G.removeCardFromBox(user, id, box)
        .then(() => dispatch(CS.updateNotInBox(id, box, TargetType.PERMANENT)))
    ));
    return dispatch(SL.actions.clearSelection());
  };

const removeMap =
  (mapID: MapID) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { session: { user } } = getState();
    return GM.remove(user, mapID)
      .then(() => loadMaps(true)(dispatch, getState));
  };

const removeObject =
  (objectID: ObjectID) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { senseMap: { map }, session: { user } } = getState();
    return GO.remove(user, objectID)
      .then(() => dispatch(SL.actions.clearSelection()))
      .then(() => loadObjects(map, true)(dispatch, getState))
      .then(() => loadCards(map, true)(dispatch, getState))
      .then(() => loadBoxes(map, true)(dispatch, getState));
  };

const removeObjects =
  (objectIDList: ObjectID[]) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { senseMap: { map }, session: { user } } = getState();
    const ps = objectIDList.map(id => GO.remove(user, id));
    return Promise.all(ps)
      .then(() => dispatch(SL.actions.clearSelection()))
      .then(() => loadObjects(map, true)(dispatch, getState))
      .then(() => loadCards(map, true)(dispatch, getState))
      .then(() => loadBoxes(map, true)(dispatch, getState));
  };

const removeCard =
  (cardID: CardID) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { senseMap: { map }, session: { user } } = getState();
    return GC.remove(user, cardID)
      .then(() => dispatch(SL.actions.clearSelection()))
      .then(() => loadCards(map, true)(dispatch, getState))
      .then(() => loadObjects(map, true)(dispatch, getState));
  };

const removeCardWithObject =
  (cardID: CardID) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { session: { user } } = getState();
    return G.deleteObjectsByCard(user, cardID)
      .then(() => removeCard(cardID)(dispatch, getState));
  };

const removeBox =
  (boxID: BoxID) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { senseMap: { map }, senseObject, session: { user } } = getState();
    const box = CS.getBox(senseObject, boxID);
    const objects = Object.keys(box.contains);
    return removeObjects(objects)(dispatch, getState)
      .then(() => GB.remove(user, boxID))
      .then(() => dispatch(SL.actions.clearSelection()))
      .then(() => loadBoxes(map, true)(dispatch, getState))
      .then(() => loadObjects(map, true)(dispatch, getState));
  };

const removeBoxes =
  (boxIDList: BoxID[]) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { senseMap: { map }, senseObject, session: { user } } = getState();
    const ps = boxIDList.map(boxID => {
      const box = CS.getBox(senseObject, boxID);
      // remove all objects from the box
      const objects = Object.keys(box.contains);
      return removeObjects(objects)(dispatch, getState)
        .then(() => GB.remove(user, boxID));
    });
    return Promise.all(ps)
      .then(() => dispatch(SL.actions.clearSelection()))
      .then(() => loadBoxes(map, true)(dispatch, getState))
      .then(() => loadObjects(map, true)(dispatch, getState));
  };

const removeBoxWithObject =
  (boxID: BoxID) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { session: { user } } = getState();
    return G.deleteObjectsByBox(user, boxID)
      .then(() => removeBox(boxID)(dispatch, getState));
  };

const unboxCards =
  (boxID: BoxID) =>
  (dispatch: Dispatch, getState: GetState) => {
    return removeBoxWithObject(boxID)(dispatch, getState)
      .then(() => dispatch(SM.actions.setScopeToFullmap()));
  };

// TODO: should pass an edge
const createEdge =
  (map: MapID, from: ObjectID, to: ObjectID) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { session: { user } } = getState();
    return GE.create(user, map, from, to)
      .then((edge) => dispatch(
        CS.updateEdges(
          H.toIDMap<EdgeID, Edge>([ edge ]),
          TargetType.PERMANENT,
        )
      ));
  };

const updateEdge =
  (edge: Edge) =>
  (dispatch: Dispatch) =>
    // edit the edge cache
    dispatch(CS.updateEdges(H.toIDMap<EdgeID, Edge>([edge])));

const saveEdge =
  (edge: Edge) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { session: { user } } = getState();
    return GE.update(user, edge)
      .then((newEdge) => {
        const edgeMap = H.toIDMap<EdgeID, Edge>([newEdge]);
        // update the box
        dispatch(CS.updateEdges(edgeMap, TargetType.PERMANENT));
        // remove the box from the cache storage
        dispatch(CS.removeEdges(edgeMap));
      });
  };

const removeEdge =
  (map: MapID, edge: EdgeID) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { session: { user } } = getState();
    return GE.remove(user, edge)
      .then(() => loadEdges(map, true)(dispatch, getState));
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
  removeBoxes,
  loadMaps,
  cleanUp,
  loadObjects,
  loadObjectsById,
  loadCards,
  loadCardsById,
  loadBoxes,
  loadBoxesById,
  loadEdges,
  loadEdgesById,
  loadHistories,
  keepUpdating,
  createCard,
  createBoxObject,
  createObjectForCard,
  createCardObject,
  moveObject,
  addCardToBox,
  addCardsToBox,
  removeCardFromBox,
  removeCardsFromBox,
  unboxCards,
  removeMap,
  removeObject,
  removeObjects,
  removeCardWithObject,
  removeBoxWithObject,
  createEdge,
  updateEdge,
  saveEdge,
  removeEdge,
};

export type Action = CS.Action;

export const reducer = CS.reducer;
