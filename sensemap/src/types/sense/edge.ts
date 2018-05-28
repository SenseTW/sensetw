import { ActionUnion, emptyAction } from '../action';
import { HasID } from './has-id';
import { ObjectID, ObjectData } from './object';

export type EdgeID = string;

export interface Edge extends HasID<EdgeID> {
  id:        EdgeID;
  from:      ObjectID;
  to:        ObjectID;
}

export const emptyEdge = {
  id:      '0',
  from:    '0',
  to:      '0',
};

const EDGE_FROM = 'EDGE_FROM';
const edgeFrom =
  (o: ObjectData) => ({
    type: EDGE_FROM as typeof EDGE_FROM,
    payload: o.id,
  });

const EDGE_TO = 'EDGE_TO';
const edgeTo =
  (o: ObjectData) => ({
    type: EDGE_TO as typeof EDGE_TO,
    payload: o.id,
  });

export const actions = {
  edgeFrom,
  edgeTo,
};

export type Action = ActionUnion<typeof actions>;

export const reducer = (state: Edge = emptyEdge, action: Action = emptyAction): Edge => {
  switch (action.type) {
    case EDGE_FROM: {
      return { ...state, from: action.payload };
    }
    case EDGE_TO: {
      return { ...state, to: action.payload };
    }
    default: {
      return state;
    }
  }
};
