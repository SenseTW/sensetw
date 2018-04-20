import { Dispatch as ReduxDispatch } from 'redux';
import * as SC from './sense-card';
import { objectId } from './utils';

const graphQLEndpoint = 'https://api.graph.cool/simple/v1/cjfrvn5xl1sov0196mxmdg0gs';

export type MapID = string;
export type ObjectID
  = SC.CardID
  | SC.BoxID;

export type PositionInMap = [number, number];
type ZoomLevel = number;

export type CanvasObject = {
  id: ObjectID,
  position: PositionInMap,
  data: SC.CardData,
};

const ADD_CARDS = 'ADD_CARDS';
const addCards = (cards: CanvasObject[]) => ({
  type: ADD_CARDS as typeof ADD_CARDS,
  payload: { cards }
});

const createCard = (data: SC.CardData, position: PositionInMap) => (dispatch: ReduxDispatch<State>) => {
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
          data: SC.emptyCardData
        }))));
      });
};

const UPDATE_CARD = 'UPDATE_CARD';
type UpdateCardAction = { type: typeof UPDATE_CARD, id: SC.CardID, d: SC.CardData };
const updateCard = (id: SC.CardID, d: SC.CardData): UpdateCardAction => ({ type: UPDATE_CARD, id, d });

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
const addCardToBox = (cardID: SC.CardID, boxID: SC.BoxID): AddCardToBoxAction => ({ type: ADD_CARD_TO_BOX });

const REMOVE_CARD_FROM_BOX = 'REMOVE_CARD_FROM_BOX';
type RemoveCardFromBoxAction = { type: typeof REMOVE_CARD_FROM_BOX };
const removeCardFromBox = (cardID: SC.CardID, boxID: SC.BoxID): RemoveCardFromBoxAction =>
  ({ type: REMOVE_CARD_FROM_BOX });

const OPEN_BOX = 'OPEN_BOX';
type OpenBoxAction = { type: typeof OPEN_BOX };
const openBox = (boxID: SC.BoxID): OpenBoxAction => ({ type: OPEN_BOX });

const CLOSE_BOX = 'CLOSE_BOX';
type CloseBoxAction = { type: typeof CLOSE_BOX };
const closeBox = (boxID: SC.BoxID): CloseBoxAction => ({ type: CLOSE_BOX });

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
