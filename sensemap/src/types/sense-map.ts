import { Dispatch, GetState } from '.';
import { ActionUnion, emptyAction } from './action';
import * as D from '../graphics/drawing';
import { MapID } from './sense/map';
import { BoxID } from './sense/box';
import * as CS from './cached-storage';
import * as SL from './selection';
import * as V from './viewport';

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

export enum MapModeType {
  PART = 'PART',
  WHOLE = 'WHOLE',
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

const SET_MAP = 'SET_MAP';
const setMap =
  (map: MapID) => ({
    type: SET_MAP as typeof SET_MAP,
    payload: { map },
  });

const OPEN_INBOX = 'OPEN_INBOX';
/**
 * A message to open the inbox.
 */
const openInbox =
  () => ({
    type: OPEN_INBOX as typeof OPEN_INBOX,
  });

const ACTIVATE_INBOX_PAGE = 'ACTIVATE_INBOX_PAGE';
/**
 * A message to change the inbox activated page.
 */
const activateInboxPage =
  (page: number) => ({
    type: ACTIVATE_INBOX_PAGE as typeof ACTIVATE_INBOX_PAGE,
    payload: { page }
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

const SET_MAP_MODE = 'SET_MAP_MODE';
const setMode =
  (mode: MapModeType) => ({
    type: SET_MAP_MODE as typeof SET_MAP_MODE,
    payload: { mode },
  });

const toWholeMode =
  () =>
  (dispatch: Dispatch, getState: GetState) => {
    dispatch(setMode(MapModeType.WHOLE));
    const state = getState();
    // get scoped objects
    const { senseMap, senseObject, viewport } = state;
    let inScope;
    switch (senseMap.scope.type) {
      case MapScopeType.BOX:
        inScope = CS.scopedToBox(senseObject, senseMap.scope.box);
        break;
      case MapScopeType.FULL_MAP:
      default:
        inScope = CS.scopedToMap(senseObject);
        break;
    }
    // XXX: should use render width and height
    const objects = Object.values(CS.toStorage(inScope).objects);
    // caculate the bounding box
    let box = D.flatten(objects);
    const boxRatio = box.width / box.height;
    const center = D.getCenter(box);
    const screenRatio = viewport.width / viewport.height;
    // save the old viewport
    dispatch(V.actions.save());
    // get the zoom scale and set the new viewport
    if (boxRatio < screenRatio) {
      // fit height
      const level = viewport.height / box.height;
      const globalWidth = viewport.width / level;
      dispatch(V.actions.setViewport({ left: center.x - globalWidth / 2, top: box.y, level }));
    } else {
      // fit width
      const level = viewport.width / box.width;
      const globalHeight = viewport.height / level;
      dispatch(V.actions.setViewport({ left: box.x, top: center.y - globalHeight / 2, level }));
    }
  };

const toNormalMode =
  () =>
  (dispatch: Dispatch, getState: GetState) => {
    dispatch(setMode(MapModeType.PART));
    // recover the old viewport
    const state = getState();
    const { selection, senseObject, viewport } = state;
    dispatch(V.actions.load());
    if (SL.count(selection) !== 0) {
      // get the selected objects
      const objects = selection.objects.map(id => CS.getObject(senseObject, id));
      // caculate the bounding box
      const box = D.flatten(objects);
      const boxRatio = box.width / box.height;
      const center = D.getCenter(box);
      // get the zoom scale
      const screenRatio = viewport.width / viewport.height;
      // set the new viewport
      if (boxRatio < screenRatio) {
        // fit height
        const level = viewport.height / box.height;
        const globalWidth = viewport.width / level;
        dispatch(V.actions.setViewport({ left: center.x - globalWidth / 2, top: box.y, level }));
      } else {
        // fit width
        const level = viewport.width / box.width;
        const globalHeight = viewport.height / level;
        dispatch(V.actions.setViewport({ left: box.x, top: center.y - globalHeight / 2, level }));
      }
    }
  };

/**
 * The data constructors of map actions.
 */
const syncActions = {
  setScopeToBox,
  setScopeToFullmap,
  setMap,
  openInbox,
  activateInboxPage,
  closeInbox,
  setMode,
};

export const actions = {
  ...syncActions,
  openBox,
  closeBox,
  toWholeMode,
  toNormalMode,
};

export type Action = ActionUnion<typeof syncActions>;

export type State = {
  // we need the current map id to check if we are transitioning to a new map
  map: MapID,
  scope: MapScope,
  mode: MapModeType,
  inbox: InboxVisibility,
  activateInboxPage: number
};

export const initial: State = {
  map: '',
  scope: {
    type: MapScopeType.FULL_MAP,
  },
  mode: MapModeType.PART,
  inbox: InboxVisibility.HIDDEN,
  activateInboxPage: 1
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
    case SET_MAP: {
      return { ...state, map: action.payload.map };
    }
    case OPEN_INBOX: {
      return { ...state, inbox: InboxVisibility.VISIBLE };
    }
    case ACTIVATE_INBOX_PAGE: {
      return { ...state, activateInboxPage: action.payload.page };
    }
    case CLOSE_INBOX: {
      return { ...state, inbox: InboxVisibility.HIDDEN };
    }
    case SET_MAP_MODE: {
      const { mode } = action.payload;
      return { ...state, mode };
    }
    default:
      return state;
  }
};
