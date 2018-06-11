import { Dispatch } from '.';
import { ActionUnion, emptyAction } from './action';
import { BoxID } from './sense/box';
import * as SL from './selection';

export type MapID = string;

export enum MapScopeType {
  FULL_MAP = 'FULL_MAP',
  BOX      = 'BOX',
}

/**
 * We are at the top level of a sense map.
 */
type FullMapScope = {
  type: MapScopeType.FULL_MAP,
};

/**
 * We are in a box with an id `box`.
 */
type BoxScope = {
  type: MapScopeType.BOX,
  box: BoxID,
};

/**
 * It describes how deep we are in a sense map.
 */
export type MapScope
  = FullMapScope
  | BoxScope;

export enum InboxVisibility {
  VISIBLE = 'VISIBLE',
  HIDDEN  = 'HIDDEN',
}

const SET_SCOPE_TO_BOX = 'SET_SCOPE_TO_BOX';
/**
 * A message to set the scope to a box.
 *
 * @param {BoxID} box
 */
const setScopeToBox =
  (box: BoxID) => ({
    type: SET_SCOPE_TO_BOX as typeof SET_SCOPE_TO_BOX,
    payload: { box },
  });

const SET_SCOPE_TO_FULL_MAP = 'SET_SCOPE_TO_FULL_MAP';
/**
 * A message to set the scope to the whole map.
 */
const setScopeToFullmap =
  () => ({
    type: SET_SCOPE_TO_FULL_MAP as typeof SET_SCOPE_TO_FULL_MAP,
  });

const OPEN_INBOX = 'OPEN_INBOX';
/**
 * A message to open the inbox.
 */
const openInbox =
  () => ({
    type: OPEN_INBOX as typeof OPEN_INBOX,
  });

const CLOSE_INBOX = 'CLOSE_INBOX';
/**
 * A message to close the inbox.
 */
const closeInbox =
  () => ({
    type: CLOSE_INBOX as typeof CLOSE_INBOX,
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

/**
 * The data constructors of map actions.
 */
const syncActions = {
  setScopeToBox,
  setScopeToFullmap,
  openInbox,
  closeInbox,
};

export const actions = {
  ...syncActions,
  openBox,
  closeBox,
};

export type Action = ActionUnion<typeof syncActions>;

export type State = {
  map: MapID,
  scope: MapScope,
  inbox: InboxVisibility,
};

export const initial: State = {
  map: 'cjgdo1yhj0si501559s0hgw2a',
  scope: {
    type: MapScopeType.FULL_MAP,
  },
  inbox: InboxVisibility.HIDDEN,
};

/**
 * The action dispatcher of map actions.
 *
 * @param {State} state The input map.
 * @param {Action} action A map action.
 */
export const reducer = (state: State = initial, action: Action = emptyAction): State => {
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
    default:
      return state;
  }
};
