import { ActionUnion, emptyAction } from './index';
import { Key } from 'ts-keycode-enum';

const KEY_PRESS = 'KEY_PRESS';
const keyPress =
  (key: Key) => ({
    type: KEY_PRESS as typeof KEY_PRESS,
    payload: { key },
  });

const KEY_RELEASE = 'KEY_RELEASE';
const keyRelease =
  (key: Key) => ({
    type: KEY_RELEASE as typeof KEY_RELEASE,
    payload: { key },
  });

export const actions = {
  keyPress,
  keyRelease,
};

export type Action = ActionUnion<typeof actions>;

export type State = {
  keyStatus: { [key: string]: boolean },
};

export const initial: State = {
  keyStatus: {
    [Key.Shift]: false,
    [Key.Ctrl]: false,
  },
};

export const reducer = (state: State = initial, action: Action = emptyAction): State => {
  switch (action.type) {
    case KEY_PRESS: {
      const { key } = action.payload;
      return {
        ...state,
        keyStatus: {
          ...state.keyStatus,
          [key]: true,
        },
      };
    }
    case KEY_RELEASE: {
      const { key } = action.payload;
      return {
        ...state,
        keyStatus: {
          ...state.keyStatus,
          [key]: false,
        },
      };
    }
    default:
      return state;
  }
};