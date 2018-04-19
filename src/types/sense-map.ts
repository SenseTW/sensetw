import { Dispatch as ReduxDispatch } from 'redux';

const graphQLEndpoint = 'https://api.graph.cool/simple/v1/cjfrvn5xl1sov0196mxmdg0gs';

export type MapID = string;
export type CardID = string;
export type BoxID = string;
export type ObjectID
  = CardID
  | BoxID;
export type UserID = string;
export type TimeStamp = number;

/**
 * Cryptographically unsafe ID generator.  Only used for experimenting.
 */
function objectId() {
  const idLength = 32;
  const chars = 'abcedfghijklmnopqrstuvwxyz0123456789';
  const randomChar = () => chars[Math.floor(Math.random() * chars.length)];
  return Array(idLength).fill(0).map(randomChar).join('');
}

export type PositionInMap = [number, number];
type ZoomLevel = number;

export enum CardType {
  Empty,
  Common,
  Box
}

interface UserData {
  id: UserID;
}

export const emptyUser: UserData = {
  id: '0'
};

interface Article {
  title: string;
  url: URL;
  quote: string;
}

export const emptyArticle: Article = {
  title: '',
  url: new URL('http://example.com'),
  quote: ''
};

interface CoreCardData {
  id: CardID;
  title: string;
  description: string;
  color: string;
  created_by: UserID;
  created_at: TimeStamp;
}

interface EmptyCardData extends CoreCardData {
  type: CardType.Empty;
}

interface CommonCardData extends CoreCardData {
  type: CardType.Common;
  quote: string;
  said_by: UserID;
  referred_to: UserID;
  tags: string;
  parent: CardID | null;
  metadata: Article;
}

export interface BoxCardData extends CoreCardData {
  type: CardType.Box;
  cards: CardID[];
}

export type CardData
  = EmptyCardData
  | CommonCardData
  | BoxCardData;

export type CanvasObject = {
  id: ObjectID,
  position: PositionInMap,
  data: CardData,
};

export const emptyCardData: EmptyCardData = {
  type: CardType.Empty,
  id: '0',
  title: '',
  description: '',
  color: '#f00',
  created_by: '0',
  created_at: 0
};

export const sampleCardList: CardData[] = [{
  id: objectId(),
  type: CardType.Common,
  title: '這是一張卡',
  description: '這是卡片的內容',
  color: '#f00',
  created_by: '0',
  created_at: 0,
  quote: '這是引言',
  said_by: '0',
  referred_to: '0',
  tags: '',
  parent: null,
  metadata: emptyArticle
}, {
  id: objectId(),
  type: CardType.Common,
  title: '這是另外一張卡',
  description: '這是另外一張卡的內容',
  color: '#00f',
  created_by: '0',
  created_at: 0,
  quote: '這是另外一段引言',
  said_by: '0',
  referred_to: '0',
  tags: '',
  parent: null,
  metadata: emptyArticle
}, {
  id: objectId(),
  type: CardType.Box,
  title: '這是一個 Box',
  description: '這是 Box 的內容',
  color: '#fff',
  created_by: '0',
  created_at: 0,
  cards: []
}];
const now = +Date.now();
let card;
card = sampleCardList[0] as CommonCardData;
card.created_by = emptyUser.id;
card.created_at = now;
card.referred_to = emptyUser.id;
card.said_by = emptyUser.id;
card = sampleCardList[1] as CommonCardData;
card.created_by = emptyUser.id;
card.created_at = now;
card.referred_to = emptyUser.id;
card.said_by = emptyUser.id;
card.parent = sampleCardList[2].id;
card = sampleCardList[2] as BoxCardData;
card.created_by = emptyUser.id;
card.created_at = now;
card.cards = [sampleCardList[2].id];
export const sampleCardMap = {};
sampleCardList.forEach((c) => { sampleCardMap[c.id] = c; });

const ADD_CARDS = 'ADD_CARDS';
const addCards = (cards: CanvasObject[]) => ({
  type: ADD_CARDS as typeof ADD_CARDS,
  payload: { cards }
});

const createCard = (data: CardData, position: PositionInMap) => (dispatch: ReduxDispatch<State>) => {
  const id = objectId();
  return dispatch(addCards([{ id, position, data }]));
};

const loadCards = (mapId: MapID) => (dispatch: ReduxDispatch<State>) => {
  const query = `
    query AllCards($mapId: ID!) {
      allCards(filter: { map: { id: $mapId } }) {
        id, x, y
      }
    }`;
  const variables = { mapId };
  return fetch(graphQLEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables })
    }).then(response => response.json())
      .then(({ data }) => {
// tslint:disable-next-line:no-any
        return dispatch(addCards(data.allCards.map((d: any) => ({
          id: d.id,
          position: [d.x, d.y],
          data: emptyCardData
        }))));
      });
};

const UPDATE_CARD = 'UPDATE_CARD';
type UpdateCardAction = { type: typeof UPDATE_CARD, id: CardID, d: CardData };
const updateCard = (id: CardID, d: CardData): UpdateCardAction => ({ type: UPDATE_CARD, id, d });

const CREATE_BOX = 'CREATE_BOX';
type CreateBoxAction = { type: typeof CREATE_BOX };
const createBox = (pos: PositionInMap): CreateBoxAction => ({ type: CREATE_BOX });

const DELETE_OBJECT = 'DELETE_OBJECT';
type DeleteObjectAction = { type: typeof DELETE_OBJECT };
const deleteObject = (id: ObjectID): DeleteObjectAction => ({ type: DELETE_OBJECT });

const MOVE_OBJECT = 'MOVE_OBJECT';
const moveObject = (id: ObjectID, position: PositionInMap) => ({
  type: MOVE_OBJECT as typeof MOVE_OBJECT,
  payload: {
    id,
    position
  }
});

const ADD_CARD_TO_BOX = 'ADD_CARD_TO_BOX';
type AddCardToBoxAction = { type: typeof ADD_CARD_TO_BOX };
const addCardToBox = (cardID: CardID, boxID: BoxID): AddCardToBoxAction => ({ type: ADD_CARD_TO_BOX });

const REMOVE_CARD_FROM_BOX = 'REMOVE_CARD_FROM_BOX';
type RemoveCardFromBoxAction = { type: typeof REMOVE_CARD_FROM_BOX };
const removeCardFromBox = (cardID: CardID, boxID: BoxID): RemoveCardFromBoxAction => ({ type: REMOVE_CARD_FROM_BOX });

const OPEN_BOX = 'OPEN_BOX';
type OpenBoxAction = { type: typeof OPEN_BOX };
const openBox = (boxID: BoxID): OpenBoxAction => ({ type: OPEN_BOX });

const CLOSE_BOX = 'CLOSE_BOX';
type CloseBoxAction = { type: typeof CLOSE_BOX };
const closeBox = (boxID: BoxID): CloseBoxAction => ({ type: CLOSE_BOX });

const PAN_VIEWPORT = 'PAN_VIEWPORT';
type PanViewportAction = { type: typeof PAN_VIEWPORT };
const panViewport = (pos: PositionInMap): PanViewportAction => ({ type: PAN_VIEWPORT });

const ZOOM_VIEWPORT = 'ZOOM_VIEWPORT';
type ZoomViewportAction = { type: typeof ZOOM_VIEWPORT };
const zoomViewport = (level: ZoomLevel): ZoomViewportAction => ({ type: ZOOM_VIEWPORT });

const ADD_OBJECT_TO_SELECTION = 'ADD_OBJECT_TO_SELECTION';
type AddObjectToSelectionAction = { type: typeof ADD_OBJECT_TO_SELECTION };
const addObjectToSelection = (id: ObjectID): AddObjectToSelectionAction => ({ type: ADD_OBJECT_TO_SELECTION });

const CLEAR_SELECTION = 'CLEAR_SELECTION';
type ClearSelectionAction = { type: typeof CLEAR_SELECTION };
const clearSelection = (): ClearSelectionAction => ({ type: CLEAR_SELECTION });

export const actions = {
  addCards,
  loadCards,
  createCard,
  updateCard,
  createBox,
  deleteObject,
  moveObject,
  addCardToBox,
  removeCardFromBox,
  openBox,
  closeBox,
  panViewport,
  zoomViewport,
  addObjectToSelection,
  clearSelection
};

export type State = {
  cards: CanvasObject[]
};

export const initial: State = {
  cards: []
};

// tslint:disable-next-line:no-any
export const reducer = (state: State = initial, action: any): State => {
  switch (action.type) {
    case ADD_CARDS:
      return Object.assign({}, state, {
        cards: [...state.cards, ...action.payload.cards]
      });
    case MOVE_OBJECT:
      return state;
    default:
      return state;
  }
};
