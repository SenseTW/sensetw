import { Key } from 'ts-keycode-enum';
import { Dispatch, GetState } from '.';
import { ActionUnion, emptyAction } from './action';
import * as V from './viewport';

export type State = {
  mouseDown: Boolean,
  inbox: {
    rect: DOMRect | ClientRect,
  },
};

export const initial: State = {
  mouseDown: false,
  inbox: {
    rect: new DOMRect(),
  },
};

const STAGE_MOUSEDOWN = 'STAGE_MOUSEDOWN';
const stageMouseDown = () => ({
  type: STAGE_MOUSEDOWN as typeof STAGE_MOUSEDOWN,
});

const STAGE_MOUSEUP = 'STAGE_MOUSEUP';
const stageMouseUp = () => ({
  type: STAGE_MOUSEUP as typeof STAGE_MOUSEUP,
});

const STAGE_INBOX_RECT = 'STAGE_INBOX_RECT';
const stageInboxRect = (rect: DOMRect | ClientRect) => ({
  type: STAGE_INBOX_RECT as typeof STAGE_INBOX_RECT,
  payload: { rect },
});

const stageMouseMove =
  ({ dx, dy }: { dx: number, dy: number }) =>
  async (dispatch: Dispatch, getState: GetState) => {
    const { stage: { mouseDown }, input: { keyStatus } } = getState();
    if (mouseDown && keyStatus[Key.Space]) {
      return dispatch(V.actions.panViewport({ x: dx, y: dy }));
    }
    return dispatch(emptyAction);
  };

const syncActions = {
  stageMouseDown,
  stageMouseUp,
  stageInboxRect,
};

export const actions = {
  ...syncActions,
  stageMouseMove,
};

export type Action = ActionUnion<typeof syncActions>;

export const reducer = (state: State = initial, action: Action): State => {
  switch (action.type) {
    case STAGE_MOUSEUP: {
      return {
        ...state,
        mouseDown: false,
      };
    }
    case STAGE_MOUSEDOWN: {
      return {
        ...state,
        mouseDown: true,
      };
    }
    case STAGE_INBOX_RECT: {
      const { rect } = action.payload;

      return {
        ...state,
        inbox: {
          ...state.inbox,
          rect,
        },
      };
    }
    default: return state;
  }
};
