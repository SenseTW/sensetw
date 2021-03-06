import { ActionUnion, emptyAction } from './action';
import * as S from './storage';
import { ObjectMap, HasID, toIDMap } from './sense/has-id';
import { MapID, MapData, emptyMapData } from './sense/map';
import { ObjectID, ObjectData, emptyObjectData } from './sense/object';
import { CardID, CardData, emptyCardData } from './sense/card';
import { BoxID, BoxData, emptyBoxData } from './sense/box';
import { EdgeID, Edge, emptyEdge } from './sense/edge';
import { HistoryID, History, emptyHistory } from './sense/history';
import { UserID, UserData, anonymousUserData } from './sense/user';

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

/**
 * Creates a storage from a cached storage.
 *
 * @param {CachedStorage} storage A cached storage.
 * @returns {S.Storage} The flattened storage.
 */
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
    histories: {
      ...storage[TargetType.PERMANENT].histories,
      ...storage[TargetType.TEMPORARY].histories,
    },
    users: {
      ...storage[TargetType.PERMANENT].users,
      ...storage[TargetType.TEMPORARY].users,
    }
  };
};

/**
 * Gets a map by it's ID. It always returns a map.
 * Please use `doesMapExist` to check the existance.
 *
 * @param {CachedStorage} storage The cached storage.
 * @param {MapID} id The map ID.
 * @returns {MapData} The target map.
 */
export const getMap =
  (storage: CachedStorage, id: MapID): MapData =>
  storage[TargetType.TEMPORARY].maps[id] || storage[TargetType.PERMANENT].maps[id] || emptyMapData;

/**
 * Gets a display object by it's ID. It always returns a object.
 * Please use `doseObjectExist` to check the existance.
 *
 * @param {CachedStorage} storage The cached storage.
 * @param {ObjectID} id The display object ID.
 * @returns {ObjectData} The target display object.
 */
export const getObject =
  (storage: CachedStorage, id: ObjectID): ObjectData =>
  storage[TargetType.TEMPORARY].objects[id] || storage[TargetType.PERMANENT].objects[id] || emptyObjectData;

/**
 * Gets a card by it's ID. It always returns a card.
 * Please use `doseCardExist` to check the existance.
 *
 * @param {CachedStorage} storage The cached storage.
 * @param {CardID} id The card ID.
 * @returns {CardData} The target card data.
 */
export const getCard =
  (storage: CachedStorage, id: CardID): CardData =>
  storage[TargetType.TEMPORARY].cards[id] || storage[TargetType.PERMANENT].cards[id] || emptyCardData;

/**
 * Gets a box by it's ID. It always returns a box.
 * Please use `doesBoxExist` to check the existance.
 *
 * @param {CachedStorage} storage The cached storage.
 * @param {BoxID} id The box ID.
 * @returns {BoxData} The target box data.
 */
export const getBox =
  (storage: CachedStorage, id: BoxID): BoxData =>
  storage[TargetType.TEMPORARY].boxes[id] || storage[TargetType.PERMANENT].boxes[id] || emptyBoxData;

/**
 * Gets an edge by it's ID. It always returns a edge.
 * Please use `doesEdgeExist` to check the existance.
 *
 * @param {CachedStorage} storage The cached storage.
 * @param {EdgeID} id The edge id.
 * @returns {Edge} The target edge data.
 */
export const getEdge =
  (storage: CachedStorage, id: EdgeID): Edge =>
  storage[TargetType.TEMPORARY].edges[id] || storage[TargetType.PERMANENT].edges[id] || emptyEdge;

/**
 * Gets a history by it's ID. It always returns a history.
 * Please use `doesHistoryExist` to check the existance.
 *
 * @param {CachedStorage} storage The cached storage.
 * @param {HistoryID} id The history ID.
 * @return {History} The target history data.
 */
export const getHistory =
  (storage: CachedStorage, id: HistoryID): History =>
  storage[TargetType.TEMPORARY].histories[id] || storage[TargetType.PERMANENT].histories[id] || emptyHistory;

/**
 * Gets an user by it's ID. It always returns an user.
 * Please use `doesUserExist` to check the existance.
 *
 * @param {CachedStorage} storage The cached storage.
 * @param {UserID} id The user ID.
 * @return {UserData} The target user data.
 */
export const getUser =
  (storage: CachedStorage, id: UserID): UserData =>
  storage[TargetType.TEMPORARY].users[id] || storage[TargetType.PERMANENT].users[id] || anonymousUserData;

/**
 * Gets cards in a box by it's box ID.
 *
 * @todo It duplicates with the same function in the storage.
 *
 * @param {CachedStorage} storage The cached storage.
 * @param {BoxID} id The box ID.
 * @returns {ObjectMap<CardData>} Card data in the box.
 */
export const getCardsInBox = (storage: CachedStorage, id: BoxID): ObjectMap<CardData> =>
  Object.keys(getBox(storage, id).contains)
    .map(oid => getObject(storage, oid).data )
    .map(cid => getCard(storage, cid))
    .reduce((a, c) => { a[c.id] = c; return a; }, {});

/**
 * Checks if a map exists in a cached storage.
 *
 * @param {CachedStorage} storage The cached storage.
 * @param {MapID} id The map ID.
 * @returns {boolean} If the map exists or not.
 */
export const doesMapExist = (storage: CachedStorage, id: MapID): boolean =>
  S.doesMapExist(storage[TargetType.TEMPORARY], id) || S.doesMapExist(storage[TargetType.PERMANENT], id);

/**
 * Checks if a display object exists in a cached storage.
 *
 * @param {CachedStorage} storage The cached storage.
 * @param {ObjectID} id The display object ID.
 * @returns {boolean} If the object exists or not.
 */
export const doesObjectExist = (storage: CachedStorage, id: ObjectID): boolean =>
  S.doesObjectExist(storage[TargetType.TEMPORARY], id) || S.doesObjectExist(storage[TargetType.PERMANENT], id);

/**
 * Checks if a card exists in a cached storage.
 *
 * @param {CachedStorage} storage The cached storage.
 * @param {CardID} id The card ID.
 * @returns {boolean} If the card exists or not.
 */
export const doesCardExist = (storage: CachedStorage, id: CardID): boolean =>
  S.doesCardExist(storage[TargetType.TEMPORARY], id) || S.doesCardExist(storage[TargetType.PERMANENT], id);

/**
 * Checks if a box exists in a cached storage.
 *
 * @param {CachedStorage} storage The cached storage.
 * @param {BoxID} id The box ID.
 * @returns {boolean} If the box exists or not.
 */
export const doesBoxExist = (storage: CachedStorage, id: BoxID): boolean =>
  S.doesBoxExist(storage[TargetType.TEMPORARY], id) || S.doesBoxExist(storage[TargetType.PERMANENT], id);

/**
 * Checks if an edge exists in a cached storage.
 *
 * @param {CachedStorage} storage The cached storage.
 * @param {EdgeID} id The edge ID.
 * @returns {boolean} If the edge exists or not.
 */
export const doesEdgeExist = (storage: CachedStorage, id: EdgeID): boolean =>
  S.doesEdgeExist(storage[TargetType.TEMPORARY], id) || S.doesEdgeExist(storage[TargetType.PERMANENT], id);

/**
 * Checks if a history exists in a cached storage.
 *
 * @param {CachedStorage} storage The cached storage.
 * @param {HistoryID} id The history ID.
 * @returns {boolean} If the history exists or not.
 */
export const doesHistoryExist = (storage: CachedStorage, id: HistoryID): boolean =>
  S.doesHistoryExist(storage[TargetType.TEMPORARY], id) || S.doesHistoryExist(storage[TargetType.PERMANENT], id);

/**
 * Checks if an user exists in a cached storage.
 *
 * @param {CachedStorage} storage The cached storage.
 * @param {UserID} id The user ID.
 * @returns {boolean} If the user exists or not.
 */
export const doesUserExist = (storage: CachedStorage, id: UserID): boolean =>
  S.doesUserExist(storage[TargetType.TEMPORARY], id) || S.doesUserExist(storage[TargetType.PERMANENT], id);

/**
 * Checks if a map is a new map by it's ID.
 * A map is a new map if it only exists in the temporary storage.
 *
 * @param {CachedStorage} storage The cached storage.
 * @param {MapID} id The map ID.
 * @returns {boolean} If the given map is a new map.
 */
export const isMapNew = (storage: CachedStorage, id: MapID): boolean =>
  S.doesMapExist(storage[TargetType.TEMPORARY], id) && !S.doesMapExist(storage[TargetType.PERMANENT], id);

/**
 * Checks if a display object is a new object by it's ID.
 * A object is a new object if it only exists in the temporary storage.
 *
 * @param {CachedStorage} storage The cached storage.
 * @param {ObjectID} id The display object ID.
 * @returns {boolean} If the given object is a new map.
 */
export const isObjectNew = (storage: CachedStorage, id: ObjectID): boolean =>
  S.doesObjectExist(storage[TargetType.TEMPORARY], id) && !S.doesObjectExist(storage[TargetType.PERMANENT], id);

/**
 * Checks if a card is a new card by it's ID.
 * A card is a new card if it only exists in the temporary storage.
 *
 * @param {CachedStorage} storage The cached storage.
 * @param {CardID} id The card ID.
 * @returns {boolean} If the given card is a new card.
 */
export const isCardNew = (storage: CachedStorage, id: CardID): boolean =>
  S.doesCardExist(storage[TargetType.TEMPORARY], id) && !S.doesCardExist(storage[TargetType.PERMANENT], id);

/**
 * Checks if a box is a new box by it's ID.
 * A box is a new box if it only exists in the temporary storage.
 *
 * @param {CachedStorage} storage The cached storage.
 * @param {BoxID} id The box ID.
 * @returns {boolean} If the given box is a new box.
 */
export const isBoxNew = (storage: CachedStorage, id: BoxID): boolean =>
  S.doesBoxExist(storage[TargetType.TEMPORARY], id) && !S.doesBoxExist(storage[TargetType.PERMANENT], id);

/**
 * Checks if an edge is a new edge by it's ID.
 * An edge is a new edge if it only exists in the temporay storage.
 *
 * @param {CachedStorage} storage The cached storage.
 * @param {EdgeID} id The edge ID.
 * @returns {boolean} If the given edge is a new edge.
 */
export const isEdgeNew = (storage: CachedStorage, id: EdgeID): boolean =>
  S.doesEdgeExist(storage[TargetType.TEMPORARY], id) && !S.doesEdgeExist(storage[TargetType.PERMANENT], id);

/**
 * Checks if a history is a new history by it's ID.
 * A history is a new history if it only exists in the temporay storage.
 *
 * @param {CachedStorage} storage The cached storage.
 * @param {HistoryID} id The history ID.
 * @returns {boolean} If the given history is a new history.
 */
export const isHistoryNew = (storage: CachedStorage, id: HistoryID): boolean =>
  S.doesHistoryExist(storage[TargetType.TEMPORARY], id) && !S.doesHistoryExist(storage[TargetType.PERMANENT], id);

/**
 * Check if a map is modified(dirty).
 * A map is modified if it appears in both the temporary and the permanent storage.
 *
 * @param {CachedStorage} storage The cached storage.
 * @param {MapID} id The map ID.
 * @returns {boolean} If the map is dirty.
 */
export const isMapDirty = (storage: CachedStorage, id: MapID): boolean =>
  S.doesMapExist(storage[TargetType.TEMPORARY], id) && S.doesMapExist(storage[TargetType.PERMANENT], id);

/**
 * Check if a display object is modified(dirty).
 * An object is modified if it appears in both the temporary and the permanent storage.
 *
 * @param {CachedStorage} storage The cached storage.
 * @param {ObjectID} id The object ID.
 * @returns {boolean} If the object is dirty.
 */
export const isObjectDirty = (storage: CachedStorage, id: ObjectID): boolean =>
  S.doesObjectExist(storage[TargetType.TEMPORARY], id) && S.doesObjectExist(storage[TargetType.PERMANENT], id);

/**
 * Check if a card is modified(dirty).
 * A card is modified if it appears in both the temporary and the permanent storage.
 *
 * @param {CachedStorage} storage The cached storage.
 * @param {CardID} id The card ID.
 * @returns {boolean} If the card is dirty.
 */
export const isCardDirty = (storage: CachedStorage, id: CardID): boolean =>
  S.doesCardExist(storage[TargetType.TEMPORARY], id) && S.doesCardExist(storage[TargetType.PERMANENT], id);

/**
 * Check if a box is modified(dirty).
 * A box is modified if it appears in both the temporary and the permanent storage.
 *
 * @param {CachedStorage} storage The cached storage.
 * @param {BoxID} id The box ID.
 * @returns {boolean} If the box is dirty.
 */
export const isBoxDirty = (storage: CachedStorage, id: BoxID): boolean =>
  S.doesBoxExist(storage[TargetType.TEMPORARY], id) && S.doesBoxExist(storage[TargetType.PERMANENT], id);

/**
 * Check if an edge is modified(dirty).
 * A edge is modified if it appears in both the temporary and the permanent storage.
 *
 * @param {CachedStorage} storage The cached storage.
 * @param {EdgeID} id The edge ID.
 * @returns {boolean} If the edge is dirty.
 */
export const isEdgeDirty = (storage: CachedStorage, id: EdgeID): boolean =>
  S.doesEdgeExist(storage[TargetType.TEMPORARY], id) && S.doesEdgeExist(storage[TargetType.PERMANENT], id);

/**
 * Check if a history is modified(dirty).
 * A history is modified if it appears in both the temporary and the permanent storage.
 *
 * @param {CachedStorage} storage The cached storage.
 * @param {HistoryID} id The history ID.
 * @returns {boolean} If the history is dirty.
 */
export const isHistoryDirty = (storage: CachedStorage, id: HistoryID): boolean =>
  S.doesHistoryExist(storage[TargetType.TEMPORARY], id) && S.doesHistoryExist(storage[TargetType.PERMANENT], id);

/**
 * Checks if all maps are not modified.
 *
 * @param {CachedStorage} storage The cached storage.
 * @returns {boolean} If the maps are clean.
 */
export const areMapsClean = (storage: CachedStorage): boolean => S.hasNoMap(storage[TargetType.TEMPORARY]);

/**
 * Checks if all maps are not modified.
 *
 * @param {CachedStorage} storage The cached storage.
 * @returns {boolean} If maps are clean.
 */
export const areObjectsClean = (storage: CachedStorage): boolean => S.hasNoObject(storage[TargetType.TEMPORARY]);

/**
 * Checks if all cards are not modified.
 *
 * @param {CachedStorage} storage The cached storage.
 * @returns {boolean} If cards are clean.
 */
export const areCardsClean = (storage: CachedStorage): boolean => S.hasNoCard(storage[TargetType.TEMPORARY]);

/**
 * Checks if all boxes are not modified.
 *
 * @param {CachedStorage} storage The cached storage.
 * @returns {boolean} If boxes are clean.
 */
export const areBoxesClean = (storage: CachedStorage): boolean => S.hasNoBox(storage[TargetType.TEMPORARY]);

/**
 * Checks if all edges are not modified.
 *
 * @param {CachedStorage} storage The cached storage.
 * @returns {boolean} If edges are clean.
 */
export const areEdgesClean = (storage: CachedStorage): boolean => S.hasNoEdge(storage[TargetType.TEMPORARY]);

/**
 * Checks if all histories are not modified.
 *
 * @param {CachedStorage} storage The cached storage.
 * @returns {boolean} If histories are clean.
 */
export const areHistoriesClean = (storage: CachedStorage): boolean => S.hasNoHistory(storage[TargetType.TEMPORARY]);

/**
 * Checks if everything is not modified.
 *
 * @param {CachedStorage} storage The cached storage.
 * @returns {boolean} If everything is clean.
 */
export const isClean = (storage: CachedStorage): boolean =>
  areMapsClean(storage) &&
  areObjectsClean(storage) &&
  areCardsClean(storage) &&
  areBoxesClean(storage) &&
  areEdgesClean(storage) &&
  areHistoriesClean(storage);

/**
 * Crteas a sub object map from a key list.
 *
 * @template T The object type.
 * @param {string[]} keys The given keys.
 * @param {ObjectMap<T>} objmap The source object map.
 * @returns {ObjectMap<T>} The subset object map.
 */
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
    histories: submapByKeys(Object.keys(diff.histories), part.histories),
    users:     submapByKeys(Object.keys(diff.users), part.users),
  };

  return result;
};

/**
 * Creates a sub cached storage by a box.
 *
 * @todo duplicated
 *
 * @param {CachedStorage} storage The cached storage.
 * @param {BoxID} id The box ID.
 * @returns {CachedStorage} The cached storage inside the box.
 */
export const scopedToBox = (storage: CachedStorage, id: BoxID): CachedStorage => {
  const { contains } = getBox(storage, id);
  const filter = (key: ObjectID): boolean => !!contains[key];
  return scoped(storage, filter);
};

// XXX: duplicated
/**
 * Creates a sub cached storage by a map.
 *
 * @todo duplicated
 *
 * @param {CachedStorage} storage The cached storage.
 * @returns {CachedStorage} The cached storage inside the map.
 */
export const scopedToMap = (storage: CachedStorage): CachedStorage => {
  const filter = (key: ObjectID): boolean => !getObject(storage, key).belongsTo;
  return scoped(storage, filter);
};

export const getObjectIds = (storage: CachedStorage, target: TargetType = TargetType.TEMPORARY) =>
  S.getObjectIds(storage[target]);

export const getCardIds = (storage: CachedStorage, target: TargetType = TargetType.TEMPORARY) =>
  S.getCardIds(storage[target]);

export const getBoxIds = (storage: CachedStorage, target: TargetType = TargetType.TEMPORARY) =>
  S.getBoxIds(storage[target]);

export const getEdgeIds = (storage: CachedStorage, target: TargetType = TargetType.TEMPORARY) =>
  S.getEdgeIds(storage[target]);

export const getHistoryIds = (storage: CachedStorage, target: TargetType = TargetType.TEMPORARY) =>
  S.getHistoryIds(storage[target]);

export const getUserIds = (storage: CachedStorage, target: TargetType = TargetType.TEMPORARY) =>
  S.getUserIds(storage[target]);

/**
 * The maps updating action contructor.
 *
 * @param {ObjectMap<MapData>} maps Map data.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns A maps updating action.
 */
export const updateMaps = (maps: ObjectMap<MapData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.UPDATE_MAPS as typeof S.UPDATE_MAPS,
  payload: { maps, target },
});

/**
 * The maps overwriting action constructor.
 *
 * @param {ObjectMap<MapData>} maps Map data.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns A maps overwriting action.
 */
export const overwriteMaps = (maps: ObjectMap<MapData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.OVERWRITE_MAPS as typeof S.OVERWRITE_MAPS,
  payload: { maps, target },
});

/**
 * The maps removing action constructor.
 *
 * @param {ObjectMap<HasID<MapID>>} maps Map data.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns A maps removing action.
 */
export const removeMaps = (maps: ObjectMap<HasID<MapID>>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.REMOVE_MAPS as typeof S.REMOVE_MAPS,
  payload: { maps, target },
});

/**
 * A shortcut action to remove one map.
 *
 * @param {HasID<MapID>} map The map data.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns A maps removing action.
 */
export const removeMap = (map: HasID<MapID>, target: TargetType = TargetType.TEMPORARY) =>
  removeMaps(toIDMap<MapID, HasID<MapID>>([map]));

/**
 * The display objects updating action constructor.
 *
 * @param {ObjectMap<ObjectData>} objects Display object data.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns A objects updating action.
 */
export const updateObjects = (objects: ObjectMap<ObjectData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.UPDATE_OBJECTS as typeof S.UPDATE_OBJECTS,
  payload: { objects, target },
});

/**
 * The display objects overiting action constructor.
 *
 * @param {ObjectMap<ObjectData>} objects Display object data.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns A objects overiting action.
 */
export const overwriteObjects = (objects: ObjectMap<ObjectData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.OVERWRITE_OBJECTS as typeof S.OVERWRITE_OBJECTS,
  payload: { objects, target },
});

/**
 * The display objects removing action constructor.
 *
 * @param {ObjectMap<HasID<ObjectID>>} objects Display object data.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns A objects removing action.
 */
export const removeObjects = (objects: ObjectMap<HasID<ObjectID>>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.REMOVE_OBJECTS as typeof S.REMOVE_OBJECTS,
  payload: { objects, target },
});

/**
 * A shortcut action to remove one display object.
 *
 * @param {HasID<ObjectID>} object The display object.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns A objects removing action.
 */
export const removeObject = (object: HasID<ObjectID>, target: TargetType = TargetType.TEMPORARY) =>
  removeObjects(toIDMap<ObjectID, HasID<ObjectID>>([object]));

/**
 * The cards updating action constructor.
 *
 * @param {ObjectMap<CardData>} cards Card data.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns A cards updating action.
 */
export const updateCards = (cards: ObjectMap<CardData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.UPDATE_CARDS as typeof S.UPDATE_CARDS,
  payload: { cards, target },
});

/**
 * The cards overwriting action constructor.
 *
 * @param {ObjectMap<CardData>} cards Card data.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns A cards overwriting action.
 */
export const overwriteCards = (cards: ObjectMap<CardData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.OVERWRITE_CARDS as typeof S.OVERWRITE_CARDS,
  payload: { cards, target },
});

/**
 * The cards removing action constructor.
 *
 * @param {ObjectMap<HasID<CardID>>} cards Card data.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns A cards removing action.
 */
export const removeCards = (cards: ObjectMap<HasID<CardID>>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.REMOVE_CARDS as typeof S.REMOVE_CARDS,
  payload: { cards, target },
});

/**
 * A shortcut action to remove one card.
 *
 * @param {HasID<CardID>} card The card data.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns A cards removing action.
 */
export const removeCard = (card: HasID<CardID>, target: TargetType = TargetType.TEMPORARY) =>
  removeCards(toIDMap<CardID, HasID<CardID>>([card]));

/**
 * The boxes updating action constructor.
 *
 * @param {ObjectMap<BoxData>} boxes Box data.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns A boxes removing action.
 */
export const updateBoxes = (boxes: ObjectMap<BoxData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.UPDATE_BOXES as typeof S.UPDATE_BOXES,
  payload: { boxes, target },
});

/**
 * The boxes overwriting action constructor.
 *
 * @param {ObjectMap<BoxData>} boxes Box data.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns A boxes overwriting action.
 */
export const overwriteBoxes = (boxes: ObjectMap<BoxData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.OVERWRITE_BOXES as typeof S.OVERWRITE_BOXES,
  payload: { boxes, target },
});

/**
 * The boxes removing action constructor.
 *
 * @param {ObjectMap<HasID<BoxID>>} boxes Box data.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns A boxes removing action.
 */
export const removeBoxes = (boxes: ObjectMap<HasID<BoxID>>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.REMOVE_BOXES as typeof S.REMOVE_BOXES,
  payload: { boxes, target },
});

/**
 * A shortuct action to remove one box.
 *
 * @param {HasID<BoxID>} box The box data.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns A boxes removing action.
 */
export const removeBox = (box: HasID<BoxID>, target: TargetType = TargetType.TEMPORARY) =>
  removeBoxes(toIDMap<BoxID, HasID<BoxID>>([box]));

/**
 * The edges updating action constructor.
 *
 * @param {ObjectMap<Edge>} edges Edge data.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns An edges updating action.
 */
export const updateEdges = (edges: ObjectMap<Edge>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.UPDATE_EDGES as typeof S.UPDATE_EDGES,
  payload: { edges, target },
});

/**
 * The edges overwriting action constructor.
 *
 * @param {ObjectMap<Edge>} edges Edge data.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns An edges overwriting action.
 */
export const overwriteEdges = (edges: ObjectMap<Edge>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.OVERWRITE_EDGES as typeof S.OVERWRITE_EDGES,
  payload: { edges, target },
});

/**
 * The edges removing action constructor.
 *
 * @param {ObjectMap<HasID<EdgeID>>} edges Edge data.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns An edges removing action.
 */
export const removeEdges = (edges: ObjectMap<HasID<EdgeID>>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.REMOVE_EDGES as typeof S.REMOVE_EDGES,
  payload: { edges, target },
});

/**
 * A shortcut action to remove one edge.
 *
 * @param {HasID<EdgeID>} edge The edge data.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns An edges removing action.
 */
export const removeEdge = (edge: HasID<EdgeID>, target: TargetType = TargetType.TEMPORARY) =>
  removeEdges(toIDMap<EdgeID, HasID<EdgeID>>([edge]));

/**
 * The histories updating action constructor.
 *
 * @param {ObjectMap<History>} histories History data.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns A histories updating action.
 */
export const updateHistories = (histories: ObjectMap<History>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.UPDATE_HISTORIES as typeof S.UPDATE_HISTORIES,
  payload: { histories, target },
});

/**
 * The histories overwriting action constructor.
 *
 * @param {ObjectMap<History>} histories History data.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns A histories overwriting action.
 */
export const overwriteHistories = (histories: ObjectMap<History>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.OVERWRITE_HISTORIES as typeof S.OVERWRITE_HISTORIES,
  payload: { histories, target },
});

/**
 * The histories removing action constructor.
 *
 * @param {ObjectMap<HasID<HistoryID>>} histories History ids.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns A histories removing action.
 */
export const removeHistories = (histories: ObjectMap<HasID<HistoryID>>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.REMOVE_HISTORIES as typeof S.REMOVE_HISTORIES,
  payload: { histories, target },
});

/**
 * A shortcut action to remove one history.
 *
 * @param {HasID<HistoryID>} history The history data.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns An histories removing action.
 */
export const removeHistory = (history: HasID<HistoryID>, target: TargetType = TargetType.TEMPORARY) =>
  removeHistories(toIDMap<HistoryID, HasID<HistoryID>>([history]));

/**
 * The users updating action constructor.
 *
 * @param {ObjectMap<UserData>} users User data.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns A users updating action.
 */
export const updateUsers = (users: ObjectMap<UserData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.UPDATE_USERS as typeof S.UPDATE_USERS,
  payload: { users, target },
});

/**
 * The users overwriting action constructor.
 *
 * @param {ObjectMap<UserData>} users User data.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns A users overwriting action.
 */
export const overwriteUsers = (users: ObjectMap<UserData>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.OVERWRITE_USERS as typeof S.OVERWRITE_USERS,
  payload: { users, target },
});

/**
 * The users removing action constructor.
 *
 * @param {ObjectMap<HasID<UserID>>} users User ids.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns A users removing action.
 */
export const removeUsers = (users: ObjectMap<HasID<UserID>>, target: TargetType = TargetType.TEMPORARY) => ({
  type: S.REMOVE_USERS as typeof S.REMOVE_USERS,
  payload: { users, target },
});

/**
 * A shortcut action to remove one user.
 *
 * @param {HasID<UserID>} user The user data.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns An users removing action.
 */
export const removeUser = (user: HasID<UserID>, target: TargetType = TargetType.TEMPORARY) =>
  removeUsers(toIDMap<UserID, HasID<UserID>>([user]));

/**
 * An action constructor for moving a card out of a given box.
 *
 * @param {ObjectID} cardObject The display object to hold the card.
 * @param {BoxID} box The box ID.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns An updating action.
 */
export const updateNotInBox =
  (cardObject: ObjectID, box: BoxID, target: TargetType = TargetType.TEMPORARY) => ({
    type: S.UPDATE_NOT_IN_BOX as typeof S.UPDATE_NOT_IN_BOX,
    payload: { cardObject, box, target },
  });

/**
 * An action constructor for moving a card into a given box.
 *
 * @param {ObjectID} cardObject The display object to hold the card.
 * @param {BoxID} box The box ID.
 * @param {TargetType} [target=TargetType.TEMPORARY] The action target.
 * @returns An updating action.
 */
export const updateInBox =
  (cardObject: ObjectID, box: BoxID, target: TargetType = TargetType.TEMPORARY) => ({
    type: S.UPDATE_IN_BOX as typeof S.UPDATE_IN_BOX,
    payload: { cardObject, box, target },
  });

export const actions = {
  updateMaps,
  overwriteMaps,
  removeMaps,
  removeMap,
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
  updateHistories,
  overwriteHistories,
  removeHistories,
  removeHistory,
  updateUsers,
  overwriteUsers,
  removeUsers,
  removeUser,
};

export type Action = ActionUnion<typeof actions>;

/**
 * The cached storage reducer.
 *
 * @param {CachedStorage} [state=initial] The current cached storage.
 * @param {Action} [action=emptyAction] A cached storage action.
 * @returns {CachedStorage} A new cached storage.
 */
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
    case S.UPDATE_HISTORIES:
    case S.OVERWRITE_HISTORIES:
    case S.REMOVE_HISTORIES:
    case S.UPDATE_USERS:
    case S.OVERWRITE_USERS:
    case S.REMOVE_USERS:
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