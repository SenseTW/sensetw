import { ActionUnion } from './action';

type Position = {
  x: number;
  y: number;
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

export const actions = {
  panViewport,
  zoomViewport,
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
    default: return state;
  }
};
