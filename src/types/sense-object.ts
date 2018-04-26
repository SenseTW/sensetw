import { Dispatch as ReduxDispatch } from 'redux';
import { client } from './client';
import { CardID } from './sense-card';
import { BoxID } from './sense-box';
import { MapID } from './sense-map';
import { TimeStamp } from './utils';

export type ObjectID = string;

export enum ObjectType {
  None = 'None',
  Card = 'Card',
  Box = 'Box',
}

export const stringToType: (name: string) => ObjectType =
  name => {
    switch (name) {
      case 'NONE': return ObjectType.None;
      case 'CARD': return ObjectType.Card;
      case 'BOX': return ObjectType.Box;
      default: return ObjectType.None;
    }
  };

export interface ObjectData {
  id: ObjectID;
  createdAt: TimeStamp;
  updatedAt: TimeStamp;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  belongsTo?: BoxID;
  objectType: ObjectType;
  data: CardID | BoxID;
}

const arrayToObject: (data: ObjectData[]) => { [key: string]: ObjectData } =
  data => data.reduce((o, item) => { o[item.id] = item; return o; }, {});

export type State = {
  objects: { [key: string]: ObjectData },
};

export const initial: State = {
  objects: {},
};

const toObjectData: (o: { [key: string]: number | string }) => ObjectData =
  o => ({
    id: o.id,
    createdAt: 0,
    updatedAt: 0,
    x: o.x,
    y: o.y,
    width: o.width,
    height: o.height,
    zIndex: o.zIndex,
    objectType: stringToType(o.objectType as string),
    // XXX need to fix this later
    data: o.card || o.box,
  } as ObjectData);

const UPDATE_OBJECTS = 'UPDATE_OBJECTS';
const updateObjects =
  (objects: { [key: string]: ObjectData }) => ({
    type: UPDATE_OBJECTS as typeof UPDATE_OBJECTS,
    payload: objects,
  });

const loadObjects =
  (id: MapID) =>
  (dispatch: ReduxDispatch<State>) => {
    const query = `
      query AllObjects($id: ID!) {
        allObjects(filter: {
          map: { id: $id }
        }) {
          id, createdAt, updatedAt, x, y, width, height, zIndex,
          objectType, card { id } , box { id }
        }
      }
    `;
    const variables = { id };
    return client.request(query, variables)
      .then(({ allObjects }) => allObjects.map(toObjectData))
      .then(data => arrayToObject(data))
      // tslint:disable-next-line:no-console
      .then(data => { console.log(data); return data; })
      .then(data => dispatch(updateObjects(data)));
  };

const moveObject =
  (id: ObjectID, x: number, y: number) =>
  (dispatch: ReduxDispatch<State>) => {
    /*
    const query = `
      mutation MoveObject($id: ID!, $x: Float!, $y: Float!) {
        updateObject(id: $id, x: $x, y: $y) {
          id, x, y
        }
      }
    `;
   */
  };

export const actions = {
  updateObjects,
  loadObjects,
  moveObject,
};

export type Action = ReturnType<typeof updateObjects>;

export const reducer = (state: State = initial, action: Action): State => {
  switch (action.type) {
    case UPDATE_OBJECTS: {
      return Object.assign({}, state, {
        objects: Object.assign({}, state.objects, action.payload),
      });
    }
    default: {
      return state;
    }
  }
};

export const emptyObjectData = {
  id: '0',
  createdAt: 0,
  updatedAt: 0,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  zIndex: 0,
  objectType: ObjectType.None,
  data: '0',
};

export const sampleStateObjects = {
  '123': {
    id: '123',
    createdAt: 0,
    updatedAt: 0,
    x: 10,
    y: 30,
    width: 280,
    height: 150,
    zIndex: 0,
    objectType: ObjectType.Card,
    data: '456',
  },
  '124': {
    id: '124',
    createdAt: 0,
    updatedAt: 0,
    x: 50,
    y: 100,
    width: 280,
    height: 150,
    zIndex: 0,
    objectType: ObjectType.Card,
    belongsTo: '127',
    data: '457',
  },
  '125': {
    id: '125',
    createdAt: 0,
    updatedAt: 0,
    x: 250,
    y: 80,
    width: 280,
    height: 150,
    zIndex: 0,
    objectType: ObjectType.Card,
    belongsTo: '127',
    data: '458',
  },
  '126': {
    id: '126',
    createdAt: 0,
    updatedAt: 0,
    x: 350,
    y: 150,
    width: 280,
    height: 150,
    zIndex: 0,
    objectType: ObjectType.Card,
    data: '459',
  },
  '127': {
    id: '127',
    createdAt: 0,
    updatedAt: 0,
    x: 550,
    y: 150,
    width: 280,
    height: 100,
    zIndex: 0,
    objectType: ObjectType.Box,
    data: '461',
  },
  '137': {
    id: '137',
    createdAt: 0,
    updatedAt: 0,
    x: 50,
    y: 200,
    width: 280,
    height: 100,
    zIndex: 0,
    objectType: ObjectType.Box,
    data: '462',
  },
};
