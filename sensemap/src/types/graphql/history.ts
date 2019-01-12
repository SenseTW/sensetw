import { HasID } from '../sense/has-id';
import { UserID } from '../sense/user';
import { MapID } from '../sense/map';
import { ObjectID } from '../sense/object';
import { CardID, stringToType as toCardType } from '../sense/card';
import { BoxID } from '../sense/box';
import {
  ChangeType,
  Change,
  HistoryID,
  HistoryType,
  History
} from '../sense/history';
import { client } from './client';
import { idOrDefault } from '../sense/has-id';
import { User } from '../session';
import * as moment from 'moment';

const graphQLChangeFieldsFragment = `
  fragment changeFields on Change {
    changeType, field, before, after,
    from { id }, to { id }, object { id }, card { id }, box { id }
  }`;

interface GraphQLChangeFields {
  changeType: ChangeType;
  field?: string;
  before?: string;
  after?: string;
  from?: HasID<ObjectID>;
  to?: HasID<ObjectID>;
  object?: HasID<ObjectID>;
  card?: HasID<CardID>;
  box?: HasID<BoxID>;
}

const graphQLHistoryFieldsFragment = `
  fragment historyFields on History {
    id, createdAt, updatedAt, historyType,
    user { id }, map { id }, object { id }, card { id },
    changes { ...changeFields }
  }`;

export interface GraphQLHistoryFields {
  id: HistoryID;
  createdAt: string;
  updatedAt: string;
  historyType: HistoryType;
  user: HasID<UserID>;
  map: HasID<MapID>;
  object: HasID<ObjectID> | null;
  card: HasID<CardID> | null;
  changes: GraphQLChangeFields[];
}

const toChange: (c: GraphQLChangeFields) => Change =
  c => {
    switch (c.changeType) {
      case ChangeType.CREATE_MAP:
        return {
          changeType: ChangeType.CREATE_MAP,
        };
      case ChangeType.UPDATE_MAP:
        return {
          changeType: ChangeType.UPDATE_MAP,
          field: c.field || '',
          before: c.before || '',
          after: c.after || '',
        };
      case ChangeType.DELETE_MAP:
        return {
          changeType: ChangeType.DELETE_MAP,
        };
      case ChangeType.CREATE_OBJECT:
        return {
          changeType: ChangeType.CREATE_OBJECT,
          object: idOrDefault('', c.object),
          card: idOrDefault('', c.card),
        };
      case ChangeType.UPDATE_OBJECT:
        return {
          changeType: ChangeType.UPDATE_OBJECT,
          object: idOrDefault('', c.object),
          card: idOrDefault('', c.card),
        };
      case ChangeType.DELETE_OBJECT:
        return {
          changeType: ChangeType.DELETE_OBJECT,
          object: idOrDefault('', c.object),
          card: idOrDefault('', c.card),
        };
      case ChangeType.CREATE_CARD:
        return {
          changeType: ChangeType.CREATE_CARD,
          card: idOrDefault('', c.card),
        };
      case ChangeType.UPDATE_CARD_SUMMARY:
        return {
          changeType: ChangeType.UPDATE_CARD_SUMMARY,
          card: idOrDefault('', c.card),
          before: c.before || '',
          after: c.after || '',
        };
      case ChangeType.UPDATE_CARD_TYPE:
        return {
          changeType: ChangeType.UPDATE_CARD_TYPE,
          card: idOrDefault('', c.card),
          before: toCardType(c.before || ''),
          after: toCardType(c.after || ''),
        };
      case ChangeType.UPDATE_CARD:
        return {
          changeType: ChangeType.UPDATE_CARD,
          card: idOrDefault('', c.card),
          field: c.field || '',
          before: c.before || '',
          after: c.after || '',
        };
      case ChangeType.DELETE_CARD:
        return {
          changeType: ChangeType.DELETE_CARD,
          card: idOrDefault('', c.card),
        };
      case ChangeType.CREATE_EDGE:
        return {
          changeType: ChangeType.CREATE_EDGE,
          from: idOrDefault('', c.from),
          to: idOrDefault('', c.to),
        };
      case ChangeType.UPDATE_EDGE:
        return {
          changeType: ChangeType.UPDATE_EDGE,
        };
      case ChangeType.DELETE_EDGE:
        return {
          changeType: ChangeType.DELETE_EDGE,
          from: idOrDefault('', c.from),
          to: idOrDefault('', c.to),
        };
      case ChangeType.ADD_OBJECT_TO_BOX:
        return {
          changeType: ChangeType.ADD_OBJECT_TO_BOX,
          object: idOrDefault('', c.object),
          box: idOrDefault('', c.box),
        };
      case ChangeType.REMOVE_OBJECT_FROM_BOX:
        return {
          changeType: ChangeType.REMOVE_OBJECT_FROM_BOX,
          object: idOrDefault('', c.object),
          box: idOrDefault('', c.box),
        };
      default:
        throw new Error('unknown change type: ' + c.changeType) as never;
    }
  };

const toHistory: (h: GraphQLHistoryFields) => History =
  h => {
    const changes = h.changes.map(toChange);
    switch (h.historyType) {
      case HistoryType.MAP:
        return {
          id: h.id,
          createdAt: +moment(h.createdAt),
          updatedAt: +moment(h.updatedAt),
          historyType: HistoryType.MAP,
          // XXX: will user be null if something is going wrong?
          user: idOrDefault('', h.user),
          map: h.map.id,
          changes,
        };
      case HistoryType.OBJECT:
        return {
          id: h.id,
          createdAt: +moment(h.createdAt),
          updatedAt: +moment(h.updatedAt),
          historyType: HistoryType.OBJECT,
          user: idOrDefault('', h.user),
          map: h.map.id,
          object: idOrDefault('', h.object),
          changes,
        };
      case HistoryType.CARD:
        return {
          id: h.id,
          createdAt: +moment(h.createdAt),
          updatedAt: +moment(h.updatedAt),
          historyType: HistoryType.CARD,
          user: idOrDefault('', h.user),
          map: h.map.id,
          card: idOrDefault('', h.card),
          changes,
        };
      default:
        throw new Error('unkonwn history type: ' + h.historyType) as never;
    }
  };

export type HistoryFilter = {
  map?: MapID,
  object?: ObjectID,
  card?: CardID,
  historyType?: HistoryType,
};

export const loadAll =
  (user: User, filter: HistoryFilter = {}, first: number = 10, skip: number = 0) => {
    const query = `
      query AllHistories($filter: HistoryFilter, $first: Int, $skip: Int) {
        allHistories(filter: $filter, first: $first, skip: $skip) {
          ...historyFields
        }
      }
      ${graphQLHistoryFieldsFragment}
      ${graphQLChangeFieldsFragment}
    `;
    const variables = { filter, first, skip };
    return client(user).request(query, variables)
      .then(({ allHistories }) => allHistories.map(toHistory));
  };