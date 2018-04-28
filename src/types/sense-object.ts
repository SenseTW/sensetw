import { client } from './client';
import { CardID, CardData, stringToType as stringToCardType } from './sense-card';
import { BoxID, BoxData } from './sense-box';
import { MapID } from './sense-map';
import { TimeStamp, arrayToObject } from './utils';
import { ActionUnion, Dispatch } from '.';

export type ObjectID = string;

export enum ObjectType {
  NONE = 'NONE',
  CARD = 'CARD',
  BOX = 'BOX',
}

export const stringToType: (name: string) => ObjectType =
  name => {
    switch (name) {
      case 'NONE': return ObjectType.NONE;
      case 'CARD': return ObjectType.CARD;
      case 'BOX': return ObjectType.BOX;
      default: return ObjectType.NONE;
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

export type State = {
  objects: { [key: string]: ObjectData },
  cards: { [key: string]: CardData },
  boxes: { [key: string]: BoxData },
};

export const initial: State = {
  objects: {},
  cards: {},
  boxes: {},
};

// tslint:disable-next-line:no-any
const toData = (o: any) => {
  switch (stringToType(o.objectType as string)) {
    case ObjectType.NONE: { return undefined; }
    case ObjectType.CARD: { return o.card.id; }
    case ObjectType.BOX:  { return o.box.id;  }
    default:              { return undefined; }
  }
};

// tslint:disable-next-line:no-any
const toObjectData: (o: any) => ObjectData =
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
    data: toData(o),
    belongsTo: !!o.belongsTo ? o.belongsTo.id : null,
  } as ObjectData);

// tslint:disable-next-line:no-any
const toCardData: (c: any) => CardData =
  c => ({
    id: c.id,
    createdAt: 0,
    updatedAt: 0,
    title: c.title,
    summary: c.summary,
    saidBy: c.saidBy,
    stakeholder: c.stakeholder,
    url: c.url,
    cardType: stringToCardType(c.cardType as string),
    // tslint:disable-next-line:no-any
    objects: c.objects.map((o: any) => o.id),
  } as CardData);

// tslint:disable-next-line:no-any
const toBoxData: (b: any) => BoxData =
  b => ({
    id: b.id,
    createdAt: 0,
    updatedAt: 0,
    title: b.title,
    summary: b.summary,
    objects: b.objects.reduce(
      // tslint:disable-next-line:no-any
      (acc: any, o: any) => {
        acc[o.id] = o;
        return acc;
      },
      {}),
    contains: b.contains.reduce(
      // tslint:disable-next-line:no-any
      (acc: any, o: any) => {
        acc[o.id] = o;
        return acc;
      },
      {}),
  } as BoxData);

const UPDATE_OBJECTS = 'UPDATE_OBJECTS';
const updateObjects =
  (objects: { [key: string]: ObjectData }) => ({
    type: UPDATE_OBJECTS as typeof UPDATE_OBJECTS,
    payload: objects,
  });

const UPDATE_CARD = 'UPDATE_CARD';
const updateCard =
  (id: CardID, card: CardData) => ({
    type: UPDATE_CARD as typeof UPDATE_CARD,
    payload: { id, card }
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
      fragment cardFields on Card {
        id,
        createdAt, updatedAt,
        title, summary, saidBy, stakeholder, url, cardType,
        objects { id }, map { id }
      }
    `;
    return client.request(query, card)
      .then(({ updateCard: newCard }) => updateCard(newCard.id, newCard));
  };

const UPDATE_CARDS = 'UPDATE_CARDS';
const updateCards =
  (cards: typeof initial.cards) => ({
    type: UPDATE_CARDS as typeof UPDATE_CARDS,
    payload: cards,
  });

const UPDATE_BOX = 'UPDATE_BOX';
const updateBox =
  (id: BoxID, box: BoxData) => ({
    type: UPDATE_BOX as typeof UPDATE_BOX,
    payload: { id, box }
  });

const updateRemoteBox =
  (box: BoxData) =>
  (dispatch: Dispatch) => {
    const query = `
      mutation UpdateBox($id: ID!, $title: String, $summary: String) {
        updateBox(id: $id, title: $title, summary: $summary) {
          ...boxFields
        }
      }
      fragment boxFields on Box {
        id, createdAt, updatedAt, title, summary,
        objects { id }, map { id }
      }
    `;
    return client.request(query, box)
      .then(({ updateBox: newBox }) => updateBox(newBox.id, newBox));
  };

const UPDATE_BOXES = 'UPDATE_BOXES';
const updateBoxes =
  (boxes: typeof initial.boxes) => ({
    type: UPDATE_BOXES as typeof UPDATE_BOXES,
    payload: boxes,
  });

const loadObjects =
  (id: MapID) =>
  (dispatch: Dispatch) => {
    const query = `
      query AllObjects($id: ID!) {
        allObjects(filter: { map: { id: $id } }) {
          ...objectFields
        }
      }
      fragment objectFields on Object {
        id, createdAt, updatedAt, x, y, width, height, zIndex,
        objectType, card { id } , box { id }, belongsTo { id }
      }
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
          id, createdAt, updatedAt, title, summary,
          objects { id }, contains { id }
        }
      }
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
      fragment objectFields on Object {
        id, createdAt, updatedAt, x, y, width, height, zIndex,
        objectType, card { id } , box { id }
      }
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
      fragment objectFields on Object {
        id, createdAt, updatedAt, x, y, width, height, zIndex,
        objectType, card { id } , box { id }, belongsTo { id }
      }
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
      fragment objectFields on Object {
        id, createdAt, updatedAt, x, y, width, height, zIndex,
        objectType, card { id } , box { id }, belongsTo { id }
      }
    `;
    const variables = { cardObject };
    return client.request(query, variables)
      .then(({ updateObject }) => dispatch(updateObjects({
        [updateObject.id]: toObjectData(updateObject),
      })));
  };

export const syncActions = {
  updateObjects,
  updateCard,
  updateCards,
  updateBox,
  updateBoxes
};

export const actions = {
  updateObjects,
  updateCard,
  updateRemoteCard,
  updateCards,
  updateBox,
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
    case UPDATE_CARD: {
      const { id, card } = action.payload;

      return {
        ...state,
        cards: {
          ...state.cards,
          [id]: card
        }
      };
    }
    case UPDATE_CARDS: {
      return Object.assign({}, state, {
        cards: Object.assign({}, state.cards, action.payload),
      });
    }
    case UPDATE_BOX: {
      const { id, box } = action.payload;

      return {
        ...state,
        boxes: {
          ...state.boxes,
          [id]: box
        }
      };
    }
    case UPDATE_BOXES: {
      return Object.assign({}, state, {
        boxes: Object.assign({}, state.boxes, action.payload),
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
