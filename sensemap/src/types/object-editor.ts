import { ActionUnion, emptyAction } from './action';
import { MapID } from './sense/map';
import * as F from './sense/focus';

export enum StatusType {
  HIDE = 'SIDEBAR_HIDE',
  SHOW = 'SIDEBAR_SHOW',
}

const CHANGE_STATUS = 'CHANGE_STATUS';
const changeStatus =
  (status: StatusType) => ({
    type: CHANGE_STATUS as typeof CHANGE_STATUS,
    payload: { status },
  });

const FOCUS_OBJECT = 'FOCUS_OBJECT';
const focusObject =
  (focus: F.Focus) => ({
    type: FOCUS_OBJECT as typeof FOCUS_OBJECT,
    payload: { focus },
  });

const FOCUS_MAP = 'FOCUS_MAP';
const focusMap =
  (map?: MapID) => ({
    type: FOCUS_MAP as typeof FOCUS_MAP,
    payload: { map },
  });

export const actions = {
  changeStatus,
  focusObject,
  focusMap,
};

export type Action = ActionUnion<typeof actions>;

export type State = {
  status: StatusType,
  focus: F.Focus,
  map?: MapID,
};

export const initial: State = {
  status: StatusType.HIDE,
  focus: F.focusNothing(),
  map: undefined,
};

export const reducer = (state: State = initial, action: Action = emptyAction) => {
  switch (action.type) {
    case CHANGE_STATUS: {
      const { status } = action.payload;

      return { ...state, status };
    }
    case FOCUS_OBJECT: {
      const { focus } = action.payload;

      return { ...state, focus };
    }
    case FOCUS_MAP: {
      const { map } = action.payload;

      return { ...state, map };
    }
    default:
      return state;
  }
};
