// import { Dispatch as ReduxDispatch } from 'redux';
import { ActionUnion } from './index';
// import { ObjectType } from './sense-object';
import { CardID } from './sense-card';
import { BoxID } from './sense-box';

export type MapID = string;

export type PositionInMap = [number, number];
type ZoomLevel = number;

const ADD_CARD_TO_BOX = 'ADD_CARD_TO_BOX';
type AddCardToBoxAction = { type: typeof ADD_CARD_TO_BOX };
const addCardToBox = (cardID: CardID, boxID: BoxID): AddCardToBoxAction => ({ type: ADD_CARD_TO_BOX });

const REMOVE_CARD_FROM_BOX = 'REMOVE_CARD_FROM_BOX';
type RemoveCardFromBoxAction = { type: typeof REMOVE_CARD_FROM_BOX };
const removeCardFromBox = (cardID: CardID, boxID: BoxID): RemoveCardFromBoxAction =>
  ({ type: REMOVE_CARD_FROM_BOX });

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

export const actions = {
  addCardToBox,
  removeCardFromBox,
  openBox,
  closeBox,
  panViewport,
  zoomViewport,
};

export type Action = ActionUnion<typeof actions>;

export type State = {
};

export const initial: State = {
};

// tslint:disable-next-line:no-any
export const reducer = (state: State = initial, action: Action): State => {
  switch (action.type) {
    default:
      return state;
  }
};
