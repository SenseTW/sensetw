import { client } from './client';
import { CardID, CardData, stringToType as stringToCardType } from './sense-card';
import { BoxID, BoxData } from './sense-box';
import { MapID } from './sense-map';
import { TimeStamp, arrayToObject } from './utils';
import { ActionUnion, Dispatch } from '.';

export type ObjectID = string;

interface HasID {
  id: string;
}

export enum ObjectType {
  NONE = 'NONE',
  CARD = 'CARD',
  BOX  = 'BOX',
}

export const stringToType: (name: string) => ObjectType =
  name => {
    switch (name) {
      case 'NONE': return ObjectType.NONE;
      case 'CARD': return ObjectType.CARD;
      case 'BOX':  return ObjectType.BOX;
      default:     return ObjectType.NONE;
    }
  };

export interface ObjectData {
  id:         ObjectID;
  createdAt:  TimeStamp;
  updatedAt:  TimeStamp;
  x:          number;
  y:          number;
  width:      number;
  height:     number;
  zIndex:     number;
  objectType: ObjectType;
  belongsTo?: BoxID;
  data:       CardID | BoxID;
}

export type State = {
  objects: { [key: string]: ObjectData },
  cards:   { [key: string]: CardData },
  boxes:   { [key: string]: BoxData },
};

export const initial: State = {
  objects: {},
  cards:   {},
  boxes:   {},
};

const graphQLObjectFieldsFragment = `
  fragment objectFields on Object {
    id, createdAt, updatedAt, x, y, width, height, zIndex,
    objectType, card { id } , box { id }, belongsTo { id }
  }`;

interface GraphQLObjectFields {
  id:         string;
  createdAt:  string;
  updatedAt:  string;
  x:          number;
  y:          number;
  width:      number;
  height:     number;
  zIndex:     number;
  objectType: string;
  card?:      HasID;
  box?:       HasID;
  belongsTo?: HasID;
}

const idOrUndefined: (o?: HasID) => string | undefined =
  (o) => {
    if (!o) {
      return undefined;
    }
    return o.id;
  };

const idOrError: (err: string, o?: HasID) => string =
  (err, o) => {
    if (!o) {
      throw Error(err);
    }
    return o.id;
  };

const toObjectDataFieldData: (o: GraphQLObjectFields) => string =
  o => {
    switch (stringToType(o.objectType)) {
      case ObjectType.NONE: {
        throw Error('Object loaded from backend has no objectType.');
      }
      case ObjectType.CARD: {
        return idOrError('Object of type CARD does not has Card ID.',
                         o.card);
      }
      case ObjectType.BOX: {
        return idOrError('Object of type BOX does not has Box ID.',
                         o.box);
      }
      default: {
        throw Error('Object loaded from backend has no objectType.');
      }
    }
  };

const toObjectData: (o: GraphQLObjectFields) => ObjectData =
  o => ({
    id:         o.id,
    createdAt:  0, // TODO
    updatedAt:  0, // TODO
    x:          o.x,
    y:          o.y,
    width:      o.width,
    height:     o.height,
    zIndex:     o.zIndex,
    objectType: stringToType(o.objectType),
    data:       toObjectDataFieldData(o),
    belongsTo:  idOrUndefined(o.belongsTo),
  });

const graphQLCardFieldsFragment = `
  fragment cardFields on Card {
    id,
    createdAt, updatedAt,
    title, summary, saidBy, stakeholder, url, cardType,
    objects { id }, map { id }
  }`;

interface GraphQLCardFields {
  id:          string;
  createdAt:   string;
  updatedAt:   string;
  title:       string;
  summary:     string;
  saidBy:      string;
  stakeholder: string;
  url:         string;
  cardType:    string;
  objects:     HasID[];
  map?:        HasID;
}

function toIDMap<T extends HasID>(objects: T[]): { [key: string]: T } {
  return objects
    .reduce(
      (acc, o) => {
        acc[o.id] = o;
        return acc;
      },
      {});
}

const toCardData: (c: GraphQLCardFields) => CardData =
  c => ({
    id:          c.id,
    createdAt:   0, // TODO
    updatedAt:   0, // TODO
    title:       c.title,
    summary:     c.summary,
    saidBy:      c.saidBy,
    stakeholder: c.stakeholder,
    url:         c.url,
    cardType:    stringToCardType(c.cardType),
    objects:     toIDMap(c.objects),
  });

const graphQLBoxFieldsFragment = `
  fragment boxFields on Box {
    id, createdAt, updatedAt, title, summary,
    objects { id }, contains { id }, map { id }
  }`;

interface GraphQLBoxFields {
  id:        string;
  createdAt: string;
  updatedAt: string;
  title:     string;
  summary:   string;
  objects:   HasID[];
  contains:  HasID[];
  map?:      HasID;
}

const toBoxData: (b: GraphQLBoxFields) => BoxData =
  b => ({
    id:        b.id,
    createdAt: 0, // TODO
    updatedAt: 0, // TODO
    title:     b.title,
    summary:   b.summary,
    objects:   toIDMap(b.objects),
    contains:  toIDMap(b.contains),
  });

const UPDATE_OBJECTS = 'UPDATE_OBJECTS';
const updateObjects =
  (objects: { [key: string]: ObjectData }) => ({
    type: UPDATE_OBJECTS as typeof UPDATE_OBJECTS,
    payload: objects,
  });

/**
 * Partially update `cards` in Redux state.
 */
const UPDATE_CARDS = 'UPDATE_CARDS';
const updateCards =
  (cards: State['cards']) => ({
    type: UPDATE_CARDS as typeof UPDATE_CARDS,
    payload: cards,
  });

/**
 * Partially update `boxes` in Redux state.
 */
const UPDATE_BOXES = 'UPDATE_BOXES';
const updateBoxes =
  (boxes: State['boxes']) => ({
    type: UPDATE_BOXES as typeof UPDATE_BOXES,
    payload: boxes,
  });

const updateRemoteCard =
  (card: CardData) =>
  (dispatch: Dispatch) => {
    const query = `
      mutation UpdateCard(
        $id: ID!,
        $title: String,
        $summary: String,
        $saidBy: String,
        $stakeholder: String,
        $url: String,
        $cardType: CardType
      ) {
        updateCard(
          id: $id,
          title: $title,
          summary: $summary,
          saidBy: $saidBy,
          stakeholder: $stakeholder,
          url: $url
          cardType: $cardType
        ) {
          ...cardFields
        }
      }
      ${graphQLCardFieldsFragment}
    `;
    return client.request(query, card)
      .then(({ updateCard: newCard }) => updateCards(toIDMap([toCardData(newCard)])));
  };

const updateRemoteBox =
  (box: BoxData) =>
  (dispatch: Dispatch) => {
    const query = `
      mutation UpdateBox($id: ID!, $title: String, $summary: String) {
        updateBox(id: $id, title: $title, summary: $summary) {
          ...boxFields
        }
      }
      ${graphQLBoxFieldsFragment}
    `;
    return client.request(query, box)
      .then(({ updateBox: newBox }) => updateBoxes(toIDMap([toBoxData(newBox)])));
  };

const loadObjects =
  (id: MapID) =>
  (dispatch: Dispatch) => {
    const query = `
      query AllObjects($id: ID!) {
        allObjects(filter: { map: { id: $id } }) {
          ...objectFields
        }
      }
      ${graphQLObjectFieldsFragment}
    `;
    const variables = { id };
    return client.request(query, variables)
      .then(({ allObjects }) => allObjects.map(toObjectData))
      .then(data => arrayToObject<ObjectData>(data))
      .then(data => dispatch(updateObjects(data)));
  };

const loadCards =
  (id: MapID) =>
  (dispatch: Dispatch) => {
    const query = `
      query AllCards($id: ID!) {
        allCards(filter: { map: { id: $id } }) {
          id, createdAt, updatedAt, title, summary, saidBy, stakeholder,
          url, cardType, objects { id }
        }
      }
    `;
    const variables = { id };
    return client.request(query, variables)
      .then(({ allCards }) => allCards.map(toCardData))
      .then(data => arrayToObject<CardData>(data))
      .then(data => dispatch(updateCards(data)));
  };

const loadBoxes =
  (id: MapID) =>
  (dispatch: Dispatch) => {
    const query = `
      query AllBoxes($id: ID!) {
        allBoxes(filter: { map: { id: $id } }) {
          ...boxFields
        }
      }
      ${graphQLBoxFieldsFragment}
    `;
    const variables = { id };
    return client.request(query, variables)
      .then(({ allBoxes }) => allBoxes.map(toBoxData))
      .then(data => arrayToObject<BoxData>(data))
      .then(data => dispatch(updateBoxes(data)));
  };

const moveObject =
  (id: ObjectID, x: number, y: number) =>
  (dispatch: Dispatch) => {
    const query = `
      mutation MoveObject($id: ID!, $x: Float!, $y: Float!) {
        updateObject(id: $id, x: $x, y: $y) {
          ...objectFields
        }
      }
      ${graphQLObjectFieldsFragment}
    `;
    const variables = { id, x, y };
    return client.request(query, variables)
      .then(({ updateObject }) => dispatch(updateObjects({
        [updateObject.id]: toObjectData(updateObject),
      })));
  };

const addCardToBox =
  (cardObject: ObjectID, box: BoxID) =>
  (dispatch: Dispatch) => {
    const query = `
      mutation AddCardToBox($cardObject: ID!, $box: ID!) {
        updateObject(id: $cardObject, belongsToId: $box) {
          ...objectFields
        }
      }
      ${graphQLObjectFieldsFragment}
    `;
    const variables = { cardObject, box };
    return client.request(query, variables)
      .then(({ updateObject }) => dispatch(updateObjects({
        [updateObject.id]: toObjectData(updateObject),
      })));
  };

const removeCardFromBox =
  (cardObject: ObjectID) =>
  (dispatch: Dispatch) => {
    const query = `
      mutation RemoveCardFromBox($cardObject: ID!) {
        updateObject(id: $cardObject, belongsToId: null) {
          ...objectFields
        }
      }
      ${graphQLObjectFieldsFragment}
    `;
    const variables = { cardObject };
    return client.request(query, variables)
      .then(({ updateObject }) => dispatch(updateObjects({
        [updateObject.id]: toObjectData(updateObject),
      })));
  };

export const syncActions = {
  updateObjects,
  updateCards,
  updateBoxes
};

export const actions = {
  updateObjects,
  updateRemoteCard,
  updateCards,
  updateRemoteBox,
  updateBoxes,
  loadObjects,
  loadCards,
  loadBoxes,
  moveObject,
  addCardToBox,
  removeCardFromBox,
};

export type Action = ActionUnion<typeof syncActions>;

export const reducer = (state: State = initial, action: Action): State => {
  switch (action.type) {
    case UPDATE_OBJECTS: {
      return Object.assign({}, state, {
        objects: Object.assign({}, state.objects, action.payload),
      });
    }
    case UPDATE_CARDS: {
      return {
        ...state,
        cards: { ...state.cards, ...action.payload },
      };
    }
    case UPDATE_BOXES: {
      return {
        ...state,
        boxes: { ...state.boxes, ...action.payload },
      };
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
  objectType: ObjectType.NONE,
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
    objectType: ObjectType.CARD,
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
    objectType: ObjectType.CARD,
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
    objectType: ObjectType.CARD,
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
    objectType: ObjectType.CARD,
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
    objectType: ObjectType.BOX,
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
    objectType: ObjectType.BOX,
    data: '462',
  },
};
