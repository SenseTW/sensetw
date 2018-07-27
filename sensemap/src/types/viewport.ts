import { ActionUnion } from './action';
import { Position, Dimension, emptyBoundingBox } from '../graphics/drawing';
import * as G from '../graphics/point';

type ZoomLevel = number;

export type State = {
  width:  number;
  height: number;
  top:    number;
  left:   number;
  level:  ZoomLevel;
  prevViewport?: State;
};

export type StateToTransform = (s: State) => G.Transform;

export const initial: State = {
  width:  1280,
  height: 800,
  top:    0,
  left:   0,
  level:  1.0,
  prevViewport: undefined,
};

export const viewport = (v: Partial<State>): State => ({
  ...initial,
  ...v
});

export const makeTransform: StateToTransform =
  ({ top, left, level }) => ({
    x = emptyBoundingBox.x,
    y = emptyBoundingBox.y,
    width = emptyBoundingBox.width,
    height = emptyBoundingBox.height,
  } = {}) => ({
    x: (x - left) * level,
    y: (y - top) * level,
    width: width * level,
    height: height * level,
  });

export const makeInverseTransform: StateToTransform =
  ({ top, left, level }) => ({
    x = emptyBoundingBox.x,
    y = emptyBoundingBox.y,
    width = emptyBoundingBox.width,
    height = emptyBoundingBox.height,
  } = {}) => ({
    x: x / level + left,
    y: y / level + top,
    width: width / level,
    height: height / level,
  });

export const transformObject = (trans: G.Transform, style: Object): Object => {
  if (typeof style === 'string') {
    return style;
  } else if (typeof style === 'number') {
    const { width } = trans({ width: style });
    return width;
  } else if (Array.isArray(style)) {
    return style.map(x => transformObject(trans, x));
  } else if ( typeof style === 'object') {
    let ret = {};
    Object.keys(style)
      .forEach((key) => ret[key] = transformObject(trans, style[key]));
    return ret;
  }
  return style;
};

export const getCenter = (state: State): G.Point => ({
  x: state.left + state.width / 2,
  y: state.top + state.height / 2,
});

const SET_VIEWPORT = 'SET_VIEWPORT';
/**
 * A message to set the viewport with a new viewport.
 *
 * @param state The new viewport
 */
const setViewport =
  (state: Partial<State>) => ({
    type: SET_VIEWPORT as typeof SET_VIEWPORT,
    payload: { state },
  });

const PAN_VIEWPORT = 'PAN_VIEWPORT';
/**
 * A message to move the viewport with an offset in screen space.
 *
 * @param pos The offset
 */
const panViewport =
  (pos: Position) => ({
    type: PAN_VIEWPORT as typeof PAN_VIEWPORT,
    payload: pos,
  });

const ZOOM_VIEWPORT = 'ZOOM_VIEWPORT';
/**
 * A message to zoom the viewport with a scale(level) and an optional center(origin).
 *
 * @param level The scale.
 * @param origin The center.
 */
const zoomViewport =
  (level: ZoomLevel, origin: G.Point = { x: 0, y: 0 }) => ({
    type: ZOOM_VIEWPORT as typeof ZOOM_VIEWPORT,
    payload: { level, origin }
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
    payload: {},
  });

const SAVE_VIEWPORT = 'SAVE_REPORT';
const save =
  () => ({
    type: SAVE_VIEWPORT as typeof SAVE_VIEWPORT,
  });

const LOAD_VIEWPORT = 'LOAD_VIEWPORT';
const load =
  () => ({
    type: LOAD_VIEWPORT as typeof LOAD_VIEWPORT,
  });

export const actions = {
  setViewport,
  panViewport,
  zoomViewport,
  resizeViewport,
  resetViewPort,
  save,
  load,
};

export type Action = ActionUnion<typeof actions>;

export const reducer = (state: State = initial, action: Action): State => {
  switch (action.type) {
    case SET_VIEWPORT: {
      return {
        ...state,
        ...action.payload.state,
      };
    }
    case PAN_VIEWPORT: {
      return {
        ...state,
        left: state.left - action.payload.x / state.level,
        top:  state.top  - action.payload.y / state.level,
      };
    }
    case ZOOM_VIEWPORT: {
      const { level, origin } = action.payload;
      // the old viewport offset in the global space
      const oldPoint = {
        x: (state.left - origin.x) / state.level,
        y: (state.top - origin.y) / state.level,
      };
      // the new viewport offset in the global space
      const newPoint = {
        x: (state.left - origin.x) / level,
        y: (state.top - origin.y) / level,
      };
      return {
        ...state,
        left: state.left + (newPoint.x - oldPoint.x),
        top: state.top + (newPoint.y - oldPoint.y),
        level,
      };
    }
    case RESIZE_VIEWPORT: {
      const { width, height } = action.payload.dimension;
      return { ...state, width, height };
    }
    case RESET_VIEWPORT: {
      return initial;
    }
    case SAVE_VIEWPORT: {
      return viewport({ prevViewport: state });
    }
    case LOAD_VIEWPORT: {
      if (state.prevViewport === undefined) {
        // tslint:disable-next-line:no-console
        console.error(new Error('no more viewports'));
        return state;
      }
      return state.prevViewport;
    }
    default: return state;
  }
};
