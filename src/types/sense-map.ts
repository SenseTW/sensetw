import { ActionUnion } from './index';
import { BoxID } from './sense-box';

export type MapID = string;

export enum MapScopeType {
  FULL_MAP = 'FULL_MAP',
  BOX      = 'BOX',
}

export type PositionInMap = [number, number];
type ZoomLevel = number;

const OPEN_BOX = 'OPEN_BOX';
const openBox = (box: BoxID) => ({
  type: OPEN_BOX as typeof OPEN_BOX,
  payload: { box },
});

const CLOSE_BOX = 'CLOSE_BOX';
const closeBox = (boxID: BoxID) => ({
  type: CLOSE_BOX as typeof CLOSE_BOX,
});

const PAN_VIEWPORT = 'PAN_VIEWPORT';
type PanViewportAction = { type: typeof PAN_VIEWPORT };
const panViewport = (pos: PositionInMap): PanViewportAction => ({ type: PAN_VIEWPORT });

const ZOOM_VIEWPORT = 'ZOOM_VIEWPORT';
type ZoomViewportAction = { type: typeof ZOOM_VIEWPORT };
const zoomViewport = (level: ZoomLevel): ZoomViewportAction => ({ type: ZOOM_VIEWPORT });

export const actions = {
  openBox,
  closeBox,
  panViewport,
  zoomViewport,
};

export type Action = ActionUnion<typeof actions>;

export type State = {
  scope: {
    type: MapScopeType,
    box?: BoxID,
  },
};

export const initial: State = {
  scope: {
    type: MapScopeType.FULL_MAP,
    // type: MapScopeType.BOX,
    // box: 'cjgg9ar6x0w660155wi4s2sp7'
  },
};

// tslint:disable-next-line:no-any
export const reducer = (state: State = initial, action: Action): State => {
  switch (action.type) {
    case OPEN_BOX: {
      return { ...state, ...{ scope: { type: MapScopeType.BOX, box: action.payload.box } } };
    }
    case CLOSE_BOX: {
      return { ...state, ...{ scope: { type: MapScopeType.FULL_MAP } } };
    }
    default:
      return state;
  }
};
