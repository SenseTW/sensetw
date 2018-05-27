import { ActionUnion } from './action';

type Position = {
  x: number;
  y: number;
};

export type Dimension = {
  width: number;
  height: number;
};

type ZoomLevel = number;

export type State = {
  width:  number;
  height: number;
  top:    number;
  left:   number;
};

export const initial: State = {
  width:  1280,
  height: 800,
  top:    0,
  left:   0,
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

export const actions = {
  panViewport,
  zoomViewport,
  resizeViewport,
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
      return state;
    }
    case RESIZE_VIEWPORT: {
      const { width, height } = action.payload.dimension;
      return { ...state, width, height };
    }
    default: return state;
  }
};
