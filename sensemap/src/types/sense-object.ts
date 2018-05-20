import * as moment from 'moment';
import { client } from './client';
import * as C from './sense-card';
import { CardID, CardData, emptyCardData, stringToType as stringToCardType } from './sense-card';
import * as B from './sense-box';
import { BoxID, BoxData, emptyBoxData } from './sense-box';
import { MapID } from './sense-map';
import { TimeStamp } from './utils';
import { ActionUnion, Dispatch, GetState } from '.';
import * as SL from './selection';
import * as SM from './sense-map';

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

interface PartialObjectData {
  x?:          number;
  y?:          number;
  width?:      number;
  height?:     number;
  zIndex?:     number;
  objectType?: ObjectType;
  data?:       CardID | BoxID;
}

export const objectData = (partial: PartialObjectData): ObjectData => {
  const now = +Date.now();

  return {
    ...emptyObjectData,
    ...partial,
    createdAt: now,
    updatedAt: now,
  };
};

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

export const getObject = (state: State, id: ObjectID): ObjectData => state.objects[id] || emptyObjectData;
export const getCard = (state: State, id: CardID): CardData => state.cards[id] || emptyCardData;
export const getBox = (state: State, id: BoxID): BoxData => state.boxes[id] || emptyBoxData;

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
    createdAt:  +moment(o.createdAt),
    updatedAt:  +moment(o.updatedAt),
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
    title, summary, description, tags, saidBy, stakeholder, url, cardType,
    objects { id }, map { id }
  }`;

interface GraphQLCardFields {
  id:          string;
  createdAt:   string;
  updatedAt:   string;
  title:       string;
  summary:     string;
  description: string;
  tags:        string;
  saidBy:      string;
  stakeholder: string;
  url:         string;
  cardType:    string;
  objects:     HasID[];
  map?:        HasID;
}

function toIDMap<T extends HasID>(this: void, objects: T[]): { [key: string]: T } {
  return objects.reduce((acc, o) => { acc[o.id] = o; return acc; }, {});
}

const toCardData: (c: GraphQLCardFields) => CardData =
  c => ({
    id:          c.id,
    createdAt:   +moment(c.createdAt),
    updatedAt:   +moment(c.updatedAt),
    title:       c.title,
    summary:     c.summary,
    description: c.description || '',
    tags:        c.tags || '',
    saidBy:      c.saidBy,
    stakeholder: c.stakeholder,
    url:         c.url,
    cardType:    stringToCardType(c.cardType),
    objects:     toIDMap(c.objects),
  });

const graphQLBoxFieldsFragment = `
  fragment boxFields on Box {
    id, createdAt, updatedAt, title, summary, tags,
    objects { id }, contains { id }, map { id }
  }`;

interface GraphQLBoxFields {
  id:        string;
  createdAt: string;
  updatedAt: string;
  title:     string;
  summary:   string;
  tags:      string;
  objects:   HasID[];
  contains:  HasID[];
  map?:      HasID;
}

const toBoxData: (b: GraphQLBoxFields) => BoxData =
  b => ({
    id:        b.id,
    createdAt: +moment(b.createdAt),
    updatedAt: +moment(b.updatedAt),
    title:     b.title,
    summary:   b.summary,
    tags:      b.tags || '',
    objects:   toIDMap(b.objects),
    contains:  toIDMap(b.contains),
  });

/**
 * Partially update `objects` state.
 */
const UPDATE_OBJECTS = 'UPDATE_OBJECTS';
const updateObjects =
  (objects: { [key: string]: ObjectData }) => ({
    type: UPDATE_OBJECTS as typeof UPDATE_OBJECTS,
    payload: objects,
  });

const OVERWRITE_OBJECTS = 'OVERWRITE_OBJECTS';
const overwriteObjects =
  (objects: { [key: string]: ObjectData }) => ({
    type: OVERWRITE_OBJECTS as typeof OVERWRITE_OBJECTS,
    payload: objects,
  });

/**
 * Partially update `cards` state.
 */
const UPDATE_CARDS = 'UPDATE_CARDS';
const updateCards =
  (cards: State['cards']) => ({
    type: UPDATE_CARDS as typeof UPDATE_CARDS,
    payload: cards,
  });

const OVERWRITE_CARDS = 'OVERWRITE_CARDS';
const overwriteCards =
  (cards: State['cards']) => ({
    type: OVERWRITE_CARDS as typeof OVERWRITE_CARDS,
    payload: cards,
  });

/**
 * Partially update `boxes` state.
 */
const UPDATE_BOXES = 'UPDATE_BOXES';
const updateBoxes =
  (boxes: State['boxes']) => ({
    type: UPDATE_BOXES as typeof UPDATE_BOXES,
    payload: boxes,
  });

const OVERWRITE_BOXES = 'OVERWRITE_BOXES';
const overwriteBoxes =
  (boxes: State['boxes']) => ({
    type: OVERWRITE_BOXES as typeof OVERWRITE_BOXES,
    payload: boxes,
  });

/**
 * Remove card from Box.contains bidirectional relation.
 */
const UPDATE_NOT_IN_BOX = 'UPDATE_NOT_IN_BOX';
const updateNotInBox =
  (cardObject: ObjectID, box: BoxID) => ({
    type: UPDATE_NOT_IN_BOX as typeof UPDATE_NOT_IN_BOX,
    payload: { cardObject, box }
  });

/**
 * Add card to Box.contains bidirectional relation.
 */
const UPDATE_IN_BOX = 'UPDATE_IN_BOX';
const updateInBox =
  (cardObject: ObjectID, box: BoxID) => ({
    type: UPDATE_IN_BOX as typeof UPDATE_IN_BOX,
    payload: { cardObject, box }
  });

const createCard =
  (mapId: MapID, card: CardData) =>
  async (dispatch: Dispatch) => {
    const query = `
      mutation CreateCard(
        $title: String,
        $summary: String,
        $description: String,
        $tags: String,
        $saidBy: String,
        $stakeholder: String,
        $url: String,
        $cardType: CardType,
        $mapId: ID
      ) {
        createCard(
          title: $title,
          summary: $summary,
          description: $description,
          tags: $tags,
          saidBy: $saidBy,
          stakeholder: $stakeholder,
          url: $url,
          cardType: $cardType,
          mapId: $mapId
        ) {
          ...cardFields
        }
      }
      ${graphQLCardFieldsFragment}
    `;
    return client.request(query, { ...card, mapId })
      .then(({ createCard: newCard }) => dispatch(updateCards(toIDMap<CardData>([
        toCardData(newCard),
      ]))));
  };

const updateRemoteCard =
  (card: CardData) =>
  (dispatch: Dispatch) => {
    const query = `
      mutation UpdateCard(
        $id: ID!,
        $title: String,
        $summary: String,
        $description: String,
        $tags: String,
        $saidBy: String,
        $stakeholder: String,
        $url: String,
        $cardType: CardType
      ) {
        updateCard(
          id: $id,
          title: $title,
          summary: $summary,
          description: $description,
          tags: $tags,
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
      .then(({ updateCard: newCard }) => dispatch(updateCards(toIDMap<CardData>([
        toCardData(newCard),
      ]))));
  };

const createBox =
  (mapId: MapID, box: BoxData) =>
  async (dispatch: Dispatch) => {
    const query = `
      mutation CreateBox($title: String, $summary: String, $tags: String, $mapId: ID) {
        createBox(title: $title, summary: $summary, tags: $tags, mapId: $mapId) {
          ...boxFields
        }
      }
      ${graphQLBoxFieldsFragment}
    `;
    return client.request(query, { ...box, mapId })
      .then(({ createBox: newBox }) => dispatch(updateBoxes(toIDMap<BoxData>([
        toBoxData(newBox),
      ]))));
  };

const updateRemoteBox =
  (box: BoxData) =>
  (dispatch: Dispatch) => {
    const query = `
      mutation UpdateBox($id: ID!, $title: String, $summary: String, $tags: String) {
        updateBox(id: $id, title: $title, summary: $summary, tags: $tags) {
          ...boxFields
        }
      }
      ${graphQLBoxFieldsFragment}
    `;
    return client.request(query, box)
      .then(({ updateBox: newBox }) => dispatch(updateBoxes(toIDMap<BoxData>([
        toBoxData(newBox),
      ]))));
  };

const loadObjects =
  (id: MapID, overwrite: Boolean = false) =>
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
      .then(data => toIDMap<ObjectData>(data))
      .then(data => dispatch(overwrite ? overwriteObjects(data) : updateObjects(data)));
  };

const loadCards =
  (id: MapID, overwrite: Boolean = false) =>
  (dispatch: Dispatch) => {
    const query = `
      query AllCards($id: ID!) {
        allCards(filter: { map: { id: $id } }) {
          id, createdAt, updatedAt, title, summary, description, tags, saidBy, stakeholder,
          url, cardType, objects { id }
        }
      }
    `;
    const variables = { id };
    return client.request(query, variables)
      .then(({ allCards }) => allCards.map(toCardData))
      .then(data => toIDMap<CardData>(data))
      .then(data => dispatch(overwrite ? overwriteCards(data) : updateCards(data)));
  };

const loadBoxes =
  (id: MapID, overwrite: Boolean = false) =>
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
      .then(data => toIDMap<BoxData>(data))
      .then(data => dispatch(overwrite ? overwriteBoxes(data) : updateBoxes(data)));
  };

const addCardToBox =
  (cardObject: ObjectID, box: BoxID) =>
  (dispatch: Dispatch) => {
    const query = `
      mutation AddCardToBox($cardObject: ID!, $box: ID!) {
        addToContainCards(belongsToBoxId: $box, containsObjectId: $cardObject) {
          containsObject { id } belongsToBox { id }
        }
      }
    `;
    const variables = { cardObject, box };
    return client.request(query, variables)
      .then(({ updateObject }) => dispatch(updateInBox(cardObject, box)))
      .then(() => dispatch(SL.actions.clearSelection()));
  };

const addCardsToBox =
  (cardObjects: ObjectID[], box: BoxID) =>
  async (dispatch: Dispatch) => {
    await Promise.all(
      cardObjects.map(id => dispatch(addCardToBox(id, box)))
    );
    return dispatch(SL.actions.clearSelection());
  };

const createObject =
  (mapId: MapID, data: ObjectData) =>
  (dispatch: Dispatch) => {
    const query = `
      mutation CreateObject(
        $x: Float!,
        $y: Float!,
        $width: Float!,
        $height: Float!,
        $zIndex: Float!,
        $objectType: ObjectType!,
        $data: ID,
        $mapId: ID
      ) {
        createObject(
          x: $x,
          y: $y,
          width: $width,
          height: $height,
          zIndex: $zIndex,
          objectType: $objectType,
          ${
            data.objectType === ObjectType.BOX
              ? 'boxId: $data,' :
            data.objectType === ObjectType.CARD
              ? 'cardId: $data,' :
            // otherwise
              ''
          }
          mapId: $mapId
        ) {
          ...objectFields
        }
      }
      ${graphQLObjectFieldsFragment}
    `;
    return client.request(query, { ...data, mapId })
      .then(({ createObject: newObject }) => dispatch(updateObjects(toIDMap<ObjectData>([
        toObjectData(newObject),
      ]))));
  };

const createBoxObject =
  (mapId: MapID, box: BoxData) =>
  async (dispatch: Dispatch, getState: GetState) => {
    const action = await createBox(mapId, box)(dispatch);
    const { id = '' } = Object.values(action.payload)[0] || {};
    const { senseMap: { dimension } } = getState();
    const x = (dimension[0] - B.DEFAULT_WIDTH) / 2;
    const y = (dimension[1] - B.DEFAULT_HEIGHT) / 2;
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
    const { senseMap: { dimension } } = getState();
    const x = (dimension[0] - C.DEFAULT_WIDTH) / 2;
    const y = (dimension[1] - C.DEFAULT_HEIGHT) / 2;
    const action = await createObject(
      mapId,
      objectData({
        x, y,
        objectType: ObjectType.CARD,
        data: cardId,
      })
    )(dispatch);
    const { id = '' } = Object.values(action.payload)[0] || {};
    if (box) {
      return addCardToBox(id, box)(dispatch);
    } else {
      return action;
    }
  };

const createCardObject =
  (mapId: MapID, card: CardData) =>
  async (dispatch: Dispatch, getState: GetState) => {
    const action = await createCard(mapId, card)(dispatch);
    const { id = '' } = Object.values(action.payload)[0] || {};
    return createObjectForCard(mapId, id)(dispatch, getState);
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
      .then(({ updateObject }) => dispatch(updateObjects(toIDMap<ObjectData>([
        toObjectData(updateObject),
      ]))));
  };

const removeCardFromBox =
  (cardObject: ObjectID, box: BoxID) =>
  (dispatch: Dispatch) => {
    const query = `
      mutation RemoveCardFromBox($cardObject: ID!, $box: ID!) {
        removeFromContainCards(belongsToBoxId: $box, containsObjectId: $cardObject) {
          containsObject { id } belongsToBox { id }
        }
      }
    `;
    const variables = { cardObject, box };
    return client.request(query, variables)
      .then(() => dispatch(updateNotInBox(cardObject, box)))
      .then(() => dispatch(SL.actions.clearSelection()));
  };

const removeCardsFromBox =
  (cardObjects: ObjectID[], box: BoxID) =>
  async (dispatch: Dispatch) => {
    await Promise.all(
      cardObjects.map(id => dispatch(removeCardFromBox(id, box)))
    );
    return dispatch(SL.actions.clearSelection());
  };

const deleteObjectRequest =
  (objectID: ObjectID) => {
    const query = `
      mutation DeleteObject($objectID: ID!) {
        deleteObject(id: $objectID) { ...objectFields }
      }
      ${graphQLObjectFieldsFragment}
    `;
    const variables = { objectID };
    return client.request(query, variables);
  };

const deleteObject =
  (objectID: ObjectID) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { senseMap: { map } } = getState();
    return deleteObjectRequest(objectID)
      .then(() => dispatch(SL.actions.clearSelection()))
      .then(() => dispatch(loadObjects(map, true)))
      .then(() => dispatch(loadCards(map, true)))
      .then(() => dispatch(loadBoxes(map, true)));
  };

const deleteCard =
  (cardID: CardID) =>
  (dispatch: Dispatch, getState: GetState) => {
    const query = `
      mutation DeleteCard($cardID: ID!) {
        deleteCard(id: $cardID) { ...cardFields }
      }
      ${graphQLCardFieldsFragment}
    `;
    const variables = { cardID };
    const { senseMap: { map } } = getState();
    return client.request(query, variables)
      .then(() => dispatch(SL.actions.clearSelection()))
      .then(() => dispatch(loadCards(map, true)))
      .then(() => dispatch(loadObjects(map, true)));
  };

const deleteCardWithObject =
  (cardID: CardID) =>
  (dispatch: Dispatch, getState: GetState) => {
    const query = `
      query GetCard($cardID: ID!) {
        Card(id: $cardID) { ...cardFields }
      }
      ${graphQLCardFieldsFragment}
    `;
    const variables = { cardID };
    return client.request(query, variables)
      .then(({ Card }: { Card: { objects: { id: ObjectID }[] } }) =>
            Promise.all(Card.objects.map(({ id }) => deleteObjectRequest(id))))
      .then(() => dispatch(deleteCard(cardID)));
  };

const deleteBox =
  (boxID: BoxID) =>
  (dispatch: Dispatch, getState: GetState) => {
    const query = `
      mutation DeleteBox($boxID: ID!) {
        deleteBox(id: $boxID) { ...boxFields }
      }
      ${graphQLBoxFieldsFragment}
    `;
    const variables = { boxID };
    const { senseMap: { map } } = getState();
    return client.request(query, variables)
      .then(() => dispatch(SL.actions.clearSelection()))
      .then(() => dispatch(loadBoxes(map, true)))
      .then(() => dispatch(loadObjects(map, true)));
  };

const deleteBoxWithObject =
  (boxID: BoxID) =>
  (dispatch: Dispatch, getState: GetState) => {
    const query = `
      query GetBoxObjects($boxID: ID!) {
        Box(id: $boxID) { objects { id } }
      }
    `;
    const variables = { boxID };
    return client.request(query, variables)
      .then(({ Box }: { Box: { objects: { id: ObjectID }[] } }) =>
            Promise.all(Box.objects.map(({ id }) => deleteObjectRequest(id))))
      .then(() => dispatch(deleteBox(boxID)));
  };

const unboxCards =
  (boxID: BoxID) =>
  (dispatch: Dispatch, getState: GetState) => {
    return dispatch(deleteBoxWithObject(boxID))
      .then(() => dispatch(SM.actions.setScopeToFullmap()));
  };

export const syncActions = {
  updateObjects,
  overwriteObjects,
  updateCards,
  overwriteCards,
  updateBoxes,
  overwriteBoxes,
  updateNotInBox,
  updateInBox,
};

export const actions = {
  ...syncActions,
  updateRemoteCard,
  updateRemoteBox,
  loadObjects,
  loadCards,
  loadBoxes,
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
  deleteObject,
  deleteCardWithObject,
  deleteBoxWithObject,
};

export type Action = ActionUnion<typeof syncActions>;

export const reducer = (state: State = initial, action: Action): State => {
  switch (action.type) {
    case UPDATE_OBJECTS: {
      return {
        ...state,
        objects: { ...state.objects, ...action.payload },
      };
    }
    case OVERWRITE_OBJECTS: {
      return {
        ...state,
        objects: action.payload,
      };
    }
    case UPDATE_CARDS: {
      return {
        ...state,
        cards: { ...state.cards, ...action.payload },
      };
    }
    case OVERWRITE_CARDS: {
      return {
        ...state,
        cards: action.payload,
      };
    }
    case UPDATE_BOXES: {
      return {
        ...state,
        boxes: { ...state.boxes, ...action.payload },
      };
    }
    case OVERWRITE_BOXES: {
      return {
        ...state,
        boxes: action.payload,
      };
    }
    case UPDATE_NOT_IN_BOX: {
      const box        = state.boxes[action.payload.box];
      const cardObject = state.objects[action.payload.cardObject];
      let { contains } = box;
      delete(contains[cardObject.id]);
      return {
        ...state,
        boxes: {
          ...state.boxes,
          [box.id]: { ...box, contains },
        },
        objects: {
          ...state.objects,
          [cardObject.id]: { ...cardObject, belongsTo: undefined },
        }
      };
    }
    case UPDATE_IN_BOX: {
      const box        = state.boxes[action.payload.box];
      const cardObject = state.objects[action.payload.cardObject];
      const contains   = {
        ...box.contains,
        [cardObject.id]: { id: cardObject.id },
      };
      return {
        ...state,
        boxes: {
          ...state.boxes,
          [box.id]: { ...box, contains },
        },
        objects: {
          ...state.objects,
          [cardObject.id]: { ...cardObject, belongsTo: box.id },
        },
      };
    }
    default: {
      return state;
    }
  }
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
