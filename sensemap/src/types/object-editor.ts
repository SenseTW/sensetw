import { ActionUnion, emptyAction } from './action';
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

export const actions = {
  changeStatus,
  focusObject,
};

export type Action = ActionUnion<typeof actions>;

export type State = {
  status: StatusType,
  focus: F.Focus,
};

export const initial: State = {
  status: StatusType.HIDE,
  focus: F.focusNothing(),
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
    default:
      return state;
  }
};
