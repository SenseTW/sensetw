import { ActionUnion, Dispatch } from './index';
import { BoxID } from './sense-box';
import * as SL from './selection';

export type MapID = string;

export enum MapScopeType {
  FULL_MAP = 'FULL_MAP',
  BOX      = 'BOX',
}

export type PositionInMap = [number, number];
type ZoomLevel = number;

const SET_SCOPE_TO_BOX = 'SET_SCOPE_TO_BOX';
const setScopeToBox = (box: BoxID) => ({
  type: SET_SCOPE_TO_BOX as typeof SET_SCOPE_TO_BOX,
  payload: { box },
});

const SET_SCOPE_TO_FULL_MAP = 'SET_SCOPE_TO_FULL_MAP';
const setScopeToFullmap = () => ({
  type: SET_SCOPE_TO_FULL_MAP as typeof SET_SCOPE_TO_FULL_MAP,
});

const openBox =
  (box: BoxID) =>
  (dispatch: Dispatch) => {
    return new Promise((resolve) => resolve(dispatch(setScopeToBox(box))))
      .then(() => dispatch(SL.actions.clearSelection()));
  };

const closeBox =
  () =>
  (dispatch: Dispatch) => {
    return new Promise((resolve) => resolve(dispatch(setScopeToFullmap())))
      .then(() => dispatch(SL.actions.clearSelection()));
  };

const PAN_VIEWPORT = 'PAN_VIEWPORT';
type PanViewportAction = { type: typeof PAN_VIEWPORT };
const panViewport = (pos: PositionInMap): PanViewportAction => ({ type: PAN_VIEWPORT });

const ZOOM_VIEWPORT = 'ZOOM_VIEWPORT';
type ZoomViewportAction = { type: typeof ZOOM_VIEWPORT };
const zoomViewport = (level: ZoomLevel): ZoomViewportAction => ({ type: ZOOM_VIEWPORT });

const syncActions = {
  setScopeToBox,
  setScopeToFullmap,
  panViewport,
  zoomViewport,
};

export const actions = {
  ...syncActions,
  openBox,
  closeBox,
};

export type Action = ActionUnion<typeof syncActions>;

type FullMapScope = {
  type: MapScopeType.FULL_MAP,
};

type BoxScope = {
  type: MapScopeType.BOX,
  box: BoxID,
};

export type State = {
  map: MapID,
  scope: FullMapScope | BoxScope,
};

export const initial: State = {
  map: 'cjgdo1yhj0si501559s0hgw2a',
  scope: {
    type: MapScopeType.FULL_MAP,
  },
};

export const reducer = (state: State = initial, action: Action): State => {
  switch (action.type) {
    case SET_SCOPE_TO_BOX: {
      return { ...state, ...{ scope: { type: MapScopeType.BOX, box: action.payload.box } } };
    }
    case SET_SCOPE_TO_FULL_MAP: {
      return { ...state, ...{ scope: { type: MapScopeType.FULL_MAP } } };
    }
    default:
      return state;
  }
};
