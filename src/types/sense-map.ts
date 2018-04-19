import { ActionUnion } from './index';

export type CardID = string;
export type BoxID = string;
export type EdgeID = string;
export type ObjectID
  = CardID
  | BoxID
  | EdgeID;

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
  User, // deprecated
  IBM, // deprecated
  Question,
  Answer,
  Box
}

interface CoreCardData {
  title: string;
  description: string;
}

interface EmptyCardData extends CoreCardData {
  type: CardType.Empty;
}

export interface QuestionCardData extends CoreCardData {
  type: CardType.Question;
  question: string;
}

export interface AnswerCardData extends CoreCardData {
  type: CardType.Answer;
  answer: string;
}

export interface BoxCardData extends CoreCardData {
  type: CardType.Box;
  cards: CardID[];
}

export type CardData
  = EmptyCardData
  | QuestionCardData
  | AnswerCardData
  | BoxCardData;

export type BoxData = {
  title: string,
  description: string
};

export type CanvasObject = {
  id: ObjectID,
  position: PositionInMap,
  data: CardData | BoxData
};

export const emptyCardData: EmptyCardData = {
  type: CardType.Empty,
  title: '',
  description: ''
};

const CREATE_CARD = 'CREATE_CARD';
const createCard = (data: CardData, position: PositionInMap) => ({
  type: CREATE_CARD as typeof CREATE_CARD,
  payload: { position, data }
});

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

const CREATE_EDGE = 'CREATE_EDGE';
type CreateEdgeAction = { type: typeof CREATE_EDGE };
const createEdge = (from: ObjectID, to: ObjectID): CreateEdgeAction => ({ type: CREATE_EDGE });

const DELETE_EDGE = 'DELETE_EDGE';
type DeleteEdgeAction = { type: typeof DELETE_EDGE };
const deleteEdge = (id: EdgeID): DeleteEdgeAction => ({ type: DELETE_EDGE });

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
  createCard,
  updateCard,
  createBox,
  deleteObject,
  moveObject,
  addCardToBox,
  removeCardFromBox,
  openBox,
  closeBox,
  createEdge,
  deleteEdge,
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

export const reducer = (state: State = initial, action: ActionUnion<typeof actions>): State => {
  switch (action.type) {
    case CREATE_CARD:
      return Object.assign({}, state, {
        cards: [...state.cards, Object.assign({ id: objectId() }, action.payload)]
      });
    case MOVE_OBJECT:
      return state;
    default:
      return state;
  }
};
