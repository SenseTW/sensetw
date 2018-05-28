import { Key } from 'ts-keycode-enum';
import { Dispatch, GetState } from '.';
import { ActionUnion, emptyAction } from './action';
import * as V from './viewport';

export type State = {
  mouseDown: Boolean,
};

export const initial: State = {
  mouseDown: false,
};

const STAGE_MOUSEDOWN = 'STAGE_MOUSEDOWN';
const stageMouseDown = () => ({
  type: STAGE_MOUSEDOWN as typeof STAGE_MOUSEDOWN,
});

const STAGE_MOUSEUP = 'STAGE_MOUSEUP';
const stageMouseUp = () => ({
  type: STAGE_MOUSEUP as typeof STAGE_MOUSEUP,
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
    default: return state;
  }
};
