type CardID = string;
type BoxID = string;
type ObjectID = CardID | BoxID;
type EdgeID = string;

type PositionInMap = [number, number];
type PositionInBox = [number, number];
type ZoomLevel = number;

export enum CardType {
  User,
  IBM
}

export type CardData = {
  type: CardType,
  title: string,
  description: string
};

export const emptyCardData = {
  type: CardType.User,
  title: '',
  description: ''
};

const CREATE_CARD = 'CREATE_CARD';
type CreateCardAction = { type: typeof CREATE_CARD };
const createCard = (d: CardData, pos: PositionInMap): CreateCardAction => ({ type: CREATE_CARD });

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
type MoveObjectAction = { type: typeof MOVE_OBJECT };
const moveObject = (id: ObjectID, pos: PositionInMap): MoveObjectAction => ({ type: MOVE_OBJECT });

const ADD_CARD_TO_BOX = 'ADD_CARD_TO_BOX';
type AddCardToBoxAction = { type: typeof ADD_CARD_TO_BOX };
const addCardToBox = (cardID: CardID, boxID: BoxID): AddCardToBoxAction => ({ type: ADD_CARD_TO_BOX });

const REMOVE_CARD_FROM_BOX = 'REMOVE_CARD_FROM_BOX';
type RemoveCardFromBoxAction = { type: typeof REMOVE_CARD_FROM_BOX };
const removeCardFromBox = (cardID: CardID, boxID: BoxID): RemoveCardFromBoxAction => ({ type: REMOVE_CARD_FROM_BOX });

const MOVE_CARD_IN_BOX = 'MOVE_CARD_IN_BOX';
type MoveCardInBoxAction = { type: typeof MOVE_CARD_IN_BOX };
const moveCardInBox =
  (cardID: CardID, boxID: BoxID, pos: PositionInBox): MoveCardInBoxAction =>
  ({ type: MOVE_CARD_IN_BOX });

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
  moveCardInBox,
  openBox,
  closeBox,
  createEdge,
  deleteEdge,
  panViewport,
  zoomViewport,
  addObjectToSelection,
  clearSelection
};