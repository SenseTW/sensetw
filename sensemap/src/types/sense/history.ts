import { UserID } from './user';
import { MapID, MapData } from './map';
import { ObjectID, ObjectData } from './object';
import { CardID, CardType, CardData } from './card';
import { BoxID, BoxData } from './box';
import { UserData } from './user';
import { TimeStamp } from '../utils';
import * as CS from '../cached-storage';

export enum ChangeType {
  CREATE_MAP = 'CREATE_MAP',
  UPDATE_MAP = 'UPDATE_MAP',
  DELETE_MAP = 'DELETE_MAP',
  CREATE_OBJECT = 'CREATE_OBJECT',
  UPDATE_OBJECT = 'UPDATE_OBJECT',
  DELETE_OBJECT = 'DELETE_OBJECT',
  CREATE_CARD = 'CREATE_CARD',
  UPDATE_CARD_SUMMARY = 'UPDATE_CARD_SUMMARY',
  UPDATE_CARD_TYPE = 'UPDATE_CARD_TYPE',
  UPDATE_CARD = 'UPDATE_CARD',
  DELETE_CARD = 'DELETE_CARD',
  CREATE_EDGE = 'CREATE_EDGE',
  UPDATE_EDGE = 'UPDATE_EDGE',
  DELETE_EDGE = 'DELETE_EDGE',
  ADD_OBJECT_TO_BOX = 'ADD_OBJECT_TO_BOX',
  REMOVE_OBJECT_FROM_BOX = 'REMOVE_OBJECT_FROM_BOX',
}

// XXX: should use interfaces for better IDE support
type CreateMapChange = {
  changeType: ChangeType.CREATE_MAP,
};

type UpdateMapChange = {
  changeType: ChangeType.UPDATE_MAP,
  field: string,
  before: string,
  after: string,
};

type DeleteMapChange = {
  changeType: ChangeType.DELETE_MAP,
};

type CreateObjectChange = {
  changeType: ChangeType.CREATE_OBJECT,
  object: ObjectID,
  card: CardID,
};

type UpdateObjectChange = {
  changeType: ChangeType.UPDATE_OBJECT,
  object: ObjectID,
  card: CardID,
};

type DeleteObjectChange = {
  changeType: ChangeType.DELETE_OBJECT,
  object: ObjectID,
  card: CardID,
};

type CreateEdgeChange = {
  changeType: ChangeType.CREATE_EDGE,
  from: ObjectID,
  to: ObjectID,
};

type UpdateEdgeChange = {
  changeType: ChangeType.UPDATE_EDGE,
};

type DeleteEdgeChange = {
  changeType: ChangeType.DELETE_EDGE,
  from: ObjectID,
  to: ObjectID,
};

type CreateCardChange = {
  changeType: ChangeType.CREATE_CARD,
  card: CardID,
};

type UpdateCardSummaryChange = {
  changeType: ChangeType.UPDATE_CARD_SUMMARY,
  card: CardID,
  before: string,
  after: string,
};

type UpdateCardTypeChange = {
  changeType: ChangeType.UPDATE_CARD_TYPE,
  card: CardID,
  before: CardType,
  after: CardType,
};

type UpdateCardChange = {
  changeType: ChangeType.UPDATE_CARD,
  card: CardID,
  field: string,
  before: string,
  after: string,
};

type DeleteCardChange = {
  changeType: ChangeType.DELETE_CARD,
  card: CardID,
};

type AddObjectToBoxChange = {
  changeType: ChangeType.ADD_OBJECT_TO_BOX,
  object: ObjectID,
  box: BoxID,
};

type RemoveObjectFromBoxChange = {
  changeType: ChangeType.REMOVE_OBJECT_FROM_BOX,
  object: ObjectID,
  box: BoxID,
};

export type Change
  = CreateMapChange
  | UpdateMapChange
  | DeleteMapChange
  | CreateObjectChange
  | UpdateObjectChange
  | DeleteObjectChange
  | CreateCardChange
  | UpdateCardSummaryChange
  | UpdateCardTypeChange
  | UpdateCardChange
  | DeleteCardChange
  | CreateEdgeChange
  | UpdateEdgeChange
  | DeleteEdgeChange
  | AddObjectToBoxChange
  | RemoveObjectFromBoxChange
  ;

type CreateMapRenderChange = CreateMapChange;

type UpdateMapRenderChange = UpdateMapChange;

type DeleteMapRenderChange = DeleteMapChange;

interface CreateObjectRenderChange {
  changeType: ChangeType.CREATE_OBJECT;
  object: ObjectData;
  card: CardData;
}

interface UpdateObjectRenderChange {
  changeType: ChangeType.UPDATE_OBJECT;
  object: ObjectData;
  card: CardData;
}

interface DeleteObjectRenderChange {
  changeType: ChangeType.DELETE_OBJECT;
  object: ObjectData;
  card: CardData;
}

interface CreateEdgeRenderChange {
  changeType: ChangeType.CREATE_EDGE;
  from: ObjectData;
  to: ObjectData;
}

type UpdateEdgeRenderChange = UpdateEdgeChange;

interface DeleteEdgeRenderChange {
  changeType: ChangeType.DELETE_EDGE;
  from: ObjectData;
  to: ObjectData;
}

interface CreateCardRenderChange {
  changeType: ChangeType.CREATE_CARD;
  card: CardData;
}

interface UpdateCardSummaryRenderChange {
  changeType: ChangeType.UPDATE_CARD_SUMMARY;
  card: CardData;
  before: string;
  after: string;
}

interface UpdateCardTypeRenderChange {
  changeType: ChangeType.UPDATE_CARD_TYPE;
  card: CardData;
  before: string;
  after: string;
}

interface UpdateCardRenderChange {
  changeType: ChangeType.UPDATE_CARD;
  card: CardData;
  field: string;
  before: string;
  after: string;
}

interface DeleteCardRenderChange {
  changeType: ChangeType.DELETE_CARD;
  card: CardData;
}

interface AddObjectToBoxRenderChange {
  changeType: ChangeType.ADD_OBJECT_TO_BOX;
  object: ObjectData;
  box: BoxData;
}

interface RemvoeObjectFromBoxRenderChange {
  changeType: ChangeType.REMOVE_OBJECT_FROM_BOX;
  object: ObjectData;
  box: BoxData;
}

export type RenderChange
  = CreateMapRenderChange
  | UpdateMapRenderChange
  | DeleteMapRenderChange
  | CreateObjectRenderChange
  | UpdateObjectRenderChange
  | DeleteObjectRenderChange
  | CreateCardRenderChange
  | UpdateCardSummaryRenderChange
  | UpdateCardTypeRenderChange
  | UpdateCardRenderChange
  | DeleteCardRenderChange
  | CreateEdgeRenderChange
  | UpdateEdgeRenderChange
  | DeleteEdgeRenderChange
  | AddObjectToBoxRenderChange
  | RemvoeObjectFromBoxRenderChange
  ;

export type HistoryID = string;

export enum HistoryType {
  MAP = 'MAP',
  CARD = 'CARD',
  OBJECT = 'OBJECT',
}

type BaseHistory = {
  historyType: HistoryType,
  id: HistoryID,
  createdAt: TimeStamp,
  updatedAt: TimeStamp,
  user: UserID,
  map: MapID,
  changes: Change[],
};

// Somehow the map history fields are bound to it's changes.
// So the object field and the card field are optional.
type MapHistory = BaseHistory & {
  historyType: HistoryType.MAP,
};

type ObjectHistory = BaseHistory & {
  historyType: HistoryType.OBJECT,
  object: ObjectID,
};

type CardHistory = BaseHistory & {
  historyType: HistoryType.CARD,
  card: CardID,
};

export type History
  = MapHistory
  | ObjectHistory
  | CardHistory
  ;

export interface BaseRenderHistory {
  historyType: HistoryType;
  id: HistoryID;
  createdAt: TimeStamp;
  updatedAt: TimeStamp;
  user: UserData;
  map: MapData;
  changes: RenderChange[];
}

export interface MapRenderHistory extends BaseRenderHistory {
  historyType: HistoryType.MAP;
}

export interface ObjectRenderHistory extends BaseRenderHistory {
  historyType: HistoryType.OBJECT;
  object: ObjectData;
}

export interface CardRenderHistory extends BaseRenderHistory {
  historyType: HistoryType.CARD;
  card: CardData;
}

export type RenderHistory
  = MapRenderHistory
  | ObjectRenderHistory
  | CardRenderHistory
  ;

export const emptyHistory = {
  historyType: HistoryType.MAP,
  id: '0',
  createdAt: 0,
  updatedAt: 0,
  user: '0',
  map: '0',
  changes: [],
};

const toRenderChange = (storage: CS.CachedStorage, change: Change): RenderChange => {
  switch (change.changeType) {
    case ChangeType.CREATE_MAP: {
      return change;
    }
    case ChangeType.UPDATE_MAP: {
      return change;
    }
    case ChangeType.DELETE_MAP: {
      return change;
    }
    // XXX: can't merge following cases without creating type errors
    case ChangeType.CREATE_OBJECT: {
      const { object: oid, card: cid } = change;
      const object = CS.getObject(storage, oid);
      const card = CS.getCard(storage, cid);
      return {
        changeType: change.changeType,
        object,
        card,
      };
    }
    case ChangeType.UPDATE_OBJECT: {
      const { object: oid, card: cid } = change;
      const object = CS.getObject(storage, oid);
      const card = CS.getCard(storage, cid);
      return {
        changeType: change.changeType,
        object,
        card,
      };
    }
    case ChangeType.DELETE_OBJECT: {
      const { object: oid, card: cid } = change;
      const object = CS.getObject(storage, oid);
      const card = CS.getCard(storage, cid);
      return {
        changeType: change.changeType,
        object,
        card,
      };
    }
    case ChangeType.CREATE_CARD: {
      const { card: cid } = change;
      const card = CS.getCard(storage, cid);
      return { ...change, card };
    }
    case ChangeType.UPDATE_CARD_SUMMARY: {
      const { card: cid } = change;
      const card = CS.getCard(storage, cid);
      return { ...change, card };
    }
    case ChangeType.UPDATE_CARD_TYPE: {
      const { card: cid } = change;
      const card = CS.getCard(storage, cid);
      return { ...change, card };
    }
    case ChangeType.UPDATE_CARD: {
      const { card: cid } = change;
      const card = CS.getCard(storage, cid);
      return { ...change, card };
    }
    case ChangeType.DELETE_CARD: {
      const { card: cid } = change;
      const card = CS.getCard(storage, cid);
      return { ...change, card };
    }
    case ChangeType.CREATE_EDGE: {
      const { from: fid, to: tid } = change;
      const from = CS.getObject(storage, fid);
      const to = CS.getObject(storage, tid);
      return { ...change, from, to };
    }
    case ChangeType.UPDATE_EDGE: {
      return change;
    }
    case ChangeType.DELETE_EDGE: {
      const { from: fid, to: tid } = change;
      const from = CS.getObject(storage, fid);
      const to = CS.getObject(storage, tid);
      return { ...change, from, to };
    }
    case ChangeType.ADD_OBJECT_TO_BOX: {
      const { object: oid, box: bid } = change;
      const object = CS.getObject(storage, oid);
      const box = CS.getBox(storage, bid);
      return { ...change, object, box };
    }
    case ChangeType.REMOVE_OBJECT_FROM_BOX: {
      const { object: oid, box: bid } = change;
      const object = CS.getObject(storage, oid);
      const box = CS.getBox(storage, bid);
      return { ...change, object, box };
    }
    default:
      throw new Error('unknown change: ' + change) as never;
  }
};

export const toRenderHistory = (storage: CS.CachedStorage, user: UserData, history: History): RenderHistory => {
  const { map: mid } = history;
  const map = CS.getMap(storage, mid);

  switch (history.historyType) {
    case HistoryType.MAP: {
      return {
        ...history,
        user,
        map,
        changes: history.changes.map(c => toRenderChange(storage, c)),
      };
    }
    case HistoryType.OBJECT: {
      const { object: oid } = history;
      const object = CS.getObject(storage, oid);
      return {
        ...history,
        user,
        map,
        object,
        changes: history.changes.map(c => toRenderChange(storage, c)),
      };
    }
    case HistoryType.CARD: {
      const { card: cid } = history;
      const card = CS.getCard(storage, cid);
      return {
        ...history,
        user,
        map,
        card,
        changes: history.changes.map(c => toRenderChange(storage, c)),
      };
    }
    default:
      throw new Error('unknown history: ' + history) as never;
  }
};
