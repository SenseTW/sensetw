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
  (map: MapID = '') => ({
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

const TOGGLE_MAP_EDITOR = 'TOGGLE_MAP_EDITOR';
const toggleEditor =
  (isEditing: boolean) => ({
    type: TOGGLE_MAP_EDITOR as typeof TOGGLE_MAP_EDITOR,
    payload: { isEditing },
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

const toWholeMode =
  () =>
  (dispatch: Dispatch, getState: GetState) => {
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
    let box = D.flatten(objects, D.AnchorType.TOP_LEFT);
    const boxRatio = box.width / box.height;
    const screenRatio = viewport.width / viewport.height;
    // save the old viewport
    dispatch(V.actions.save());
    // get the zoom scale and set the new viewport
    if (boxRatio < screenRatio) {
      // fit height
      const level = viewport.height / box.height;
      const centerX = box.x + box.width / 2;
      const globalWidth = viewport.width / level;
      dispatch(V.actions.setViewport({ left: centerX - globalWidth / 2, top: box.y, level }));
    } else {
      // fit width
      const level = viewport.width / box.width;
      const centerY = box.y + box.height / 2;
      const globalHeight = viewport.height / level;
      dispatch(V.actions.setViewport({ left: box.x, top: centerY - globalHeight / 2, level }));
    }
  };

const toNormalMode =
  () =>
  (dispatch: Dispatch, getState: GetState) => {
    // recover the old viewport
    const state = getState();
    const { selection, senseObject, viewport } = state;
    const ids = SL.selectedObjects(selection);
    dispatch(V.actions.load());
    if (ids.length !== 0) {
      // get the selected objects
      const objects = ids.map((id) => CS.getObject(senseObject, id));
      // caculate the bounding box
      const box = D.flatten(objects, D.AnchorType.CENTER);
      // set the new viewport
      dispatch(V.actions.setViewport({
        left: box.x - viewport.width / 2,
        top: box.y - viewport.height / 2,
        level: 1.0
      }));
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
  toggleEditor,
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
  inbox: InboxVisibility,
  activateInboxPage: number,
  isEditing: boolean,
};

export const initial: State = {
  map: '',
  scope: {
    type: MapScopeType.FULL_MAP,
  },
  inbox: InboxVisibility.HIDDEN,
  activateInboxPage: 1,
  isEditing: false,
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
    case TOGGLE_MAP_EDITOR: {
      return { ...state, isEditing: action.payload.isEditing };
    }
    default:
      return state;
  }
};
