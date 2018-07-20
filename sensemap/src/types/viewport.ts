import { ActionUnion } from './action';
import { Position, Dimension } from '../graphics/drawing';
import * as G from '../graphics/point';

type ZoomLevel = number;

export type State = {
  width:  number;
  height: number;
  top:    number;
  left:   number;
  level:  ZoomLevel;
};

export type StateToTransform = (s: State) => G.Transform;

export const initial: State = {
  width:  1280,
  height: 800,
  top:    0,
  left:   0,
  level:  1.0,
};

const PAN_VIEWPORT = 'PAN_VIEWPORT';
const panViewport =
  (pos: Position) => ({
    type: PAN_VIEWPORT as typeof PAN_VIEWPORT,
    payload: pos,
  });

const ZOOM_VIEWPORT = 'ZOOM_VIEWPORT';
const zoomViewport =
  (level: ZoomLevel) => ({
    type: ZOOM_VIEWPORT as typeof ZOOM_VIEWPORT,
    payload: { level }
  });

const RESIZE_VIEWPORT = 'RESIZE_VIEWPORT';
/**
 * A message to resize the view port. So we can create objects in the center of
 * our viewport.
 *
 * @param {DimensionInMap} dimension The new dimension(width, height).
 */
const resizeViewport =
  (dimension: Dimension) => ({
    type: RESIZE_VIEWPORT as typeof RESIZE_VIEWPORT,
    payload: { dimension }
  });

const RESET_VIEWPORT = 'RESET_VIEWPORT';
const resetViewPort = 
  () => ({
    type: RESET_VIEWPORT as typeof RESET_VIEWPORT,
    payload: {}
  });

export const actions = {
  panViewport,
  zoomViewport,
  resizeViewport,
  resetViewPort
};

export type Action = ActionUnion<typeof actions>;

export const reducer = (state: State = initial, action: Action): State => {
  switch (action.type) {
    case PAN_VIEWPORT: {
      return {
        ...state,
        left: state.left - action.payload.x,
        top:  state.top  - action.payload.y,
      };
    }
    case ZOOM_VIEWPORT: {
      return {
        ...state,
        level: action.payload.level,
      };
    }
    case RESIZE_VIEWPORT: {
      const { width, height } = action.payload.dimension;
      return { ...state, width, height };
    }
    case RESET_VIEWPORT: {
      return initial;
    }
    default: return state;
  }
};
