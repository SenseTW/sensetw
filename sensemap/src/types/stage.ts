import { Dispatch, GetState } from '.';
import { ActionUnion } from './action';
import * as V from './viewport';
import { Point } from '../graphics/point';

export type State = {
  mouseDown: Boolean,
  panned: Point,
};

export const initial: State = {
  mouseDown: false,
  panned: { x: 0, y: 0 },
};

export const isMoved = (state: State) =>
  state.panned.x !== 0 || state.panned.y !== 0;

const STAGE_MOUSEDOWN = 'STAGE_MOUSEDOWN';
const stageMouseDown = () => ({
  type: STAGE_MOUSEDOWN as typeof STAGE_MOUSEDOWN,
});

const STAGE_MOUSEMOVE = 'STAGE_MOUSEMOVE';
const stageMouseMove = (delta: Point) => ({
  type: STAGE_MOUSEMOVE as typeof STAGE_MOUSEMOVE,
  payload: { delta },
});

const STAGE_MOUSEUP = 'STAGE_MOUSEUP';
const stageMouseUp = () => ({
  type: STAGE_MOUSEUP as typeof STAGE_MOUSEUP,
});

const mouseMove =
  ({ dx, dy }: { dx: number, dy: number }) =>
  async (dispatch: Dispatch, getState: GetState) => {
    const { stage: { mouseDown } } = getState();
    if (mouseDown) {
      const delta = { x: dx, y: dy };
      dispatch(V.actions.panViewport(delta));
      dispatch(stageMouseMove(delta));
    }
    // return dispatch(emptyAction);
    return;
  };

const syncActions = {
  stageMouseDown,
  stageMouseMove,
  stageMouseUp,
};

export const actions = {
  ...syncActions,
  mouseMove,
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
    case STAGE_MOUSEMOVE: {
      const { delta } = action.payload;
      const panned = {
        x: state.panned.x + delta.x,
        y: state.panned.y + delta.y,
      };
      return {
        ...state,
        panned,
      };
    }
    case STAGE_MOUSEDOWN: {
      return {
        ...state,
        mouseDown: true,
        panned: { x: 0, y: 0 },
      };
    }
    default: return state;
  }
};
