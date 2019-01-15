import { UserID } from './user';
import { MapID } from './map';
import { ObjectID } from './object';
import { CardID, CardType } from './card';
import { BoxID } from './box';
import { TimeStamp } from '../utils';

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
  changes: Change[],
};

// Somehow the map history fields are bound to it's changes.
// So the object field and the card field are optional.
type MapHistory = BaseHistory & {
  historyType: HistoryType.MAP,
  map: MapID,
};

type ObjectHistory = BaseHistory & {
  historyType: HistoryType.OBJECT,
  map: MapID,
  object: ObjectID,
};

type CardHistory = BaseHistory & {
  historyType: HistoryType.CARD,
  map: MapID,
  card: CardID,
};

export type History
  = MapHistory
  | ObjectHistory
  | CardHistory
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
