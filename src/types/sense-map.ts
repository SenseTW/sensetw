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
    type: MapScopeType.BOX,
    box: 'cjgg9aq070w630155uqvmrslh',
  },
};

// tslint:disable-next-line:no-any
export const reducer = (state: State = initial, action: Action): State => {
  switch (action.type) {
    default:
      return state;
  }
};
