import { ActionUnion, Dispatch } from './index';
import { BoxID } from './sense-box';
import * as SL from './selection';

export type MapID = string;

export enum MapScopeType {
  FULL_MAP = 'FULL_MAP',
  BOX      = 'BOX',
}

export enum InboxVisibility {
  VISIBLE = 'VISIBLE',
  HIDDEN  = 'HIDDEN',
}

export type DimensionInMap = [number, number];

const SET_SCOPE_TO_BOX = 'SET_SCOPE_TO_BOX';
const setScopeToBox = (box: BoxID) => ({
  type: SET_SCOPE_TO_BOX as typeof SET_SCOPE_TO_BOX,
  payload: { box },
});

const SET_SCOPE_TO_FULL_MAP = 'SET_SCOPE_TO_FULL_MAP';
const setScopeToFullmap = () => ({
  type: SET_SCOPE_TO_FULL_MAP as typeof SET_SCOPE_TO_FULL_MAP,
});

const OPEN_INBOX = 'OPEN_INBOX';
const openInbox = () => ({
  type: OPEN_INBOX as typeof OPEN_INBOX,
});

const CLOSE_INBOX = 'CLOSE_INBOX';
const closeInbox = () => ({
  type: CLOSE_INBOX as typeof CLOSE_INBOX,
});

const RESIZE_VIEWPORT = 'RESIZE_VIEWPORT';
const resizeViewport =
  (dimension: DimensionInMap) => ({
    type: RESIZE_VIEWPORT as typeof RESIZE_VIEWPORT,
    payload: { dimension }
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

const syncActions = {
  setScopeToBox,
  setScopeToFullmap,
  resizeViewport,
  openInbox,
  closeInbox,
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
  dimension: DimensionInMap,
  inbox: InboxVisibility,
};

export const initial: State = {
  map: 'cjgdo1yhj0si501559s0hgw2a',
  scope: {
    type: MapScopeType.FULL_MAP,
  },
  dimension: [0, 0],
  inbox: InboxVisibility.HIDDEN,
};

export const reducer = (state: State = initial, action: Action): State => {
  switch (action.type) {
    case SET_SCOPE_TO_BOX: {
      return { ...state, ...{ scope: { type: MapScopeType.BOX, box: action.payload.box } } };
    }
    case SET_SCOPE_TO_FULL_MAP: {
      return { ...state, ...{ scope: { type: MapScopeType.FULL_MAP } } };
    }
    case OPEN_INBOX: {
      return { ...state, inbox: InboxVisibility.VISIBLE };
    }
    case CLOSE_INBOX: {
      return { ...state, inbox: InboxVisibility.HIDDEN };
    }
    case RESIZE_VIEWPORT: {
      const { dimension } = action.payload;
      return { ...state, dimension };
    }
    default:
      return state;
  }
};
