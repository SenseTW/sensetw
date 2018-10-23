import { ActionUnion, emptyAction } from '../action';
import { HasID } from './has-id';
import { ObjectID, ObjectData } from './object';
import { equals } from 'ramda';

export type EdgeID = string;

export enum EdgeType {
  NONE       = 'NONE',
  DIRECTED   = 'DIRECTED',
  REVERSED   = 'REVERSED',
  BIDIRECTED = 'BIDIRECTED',
}

export interface Edge extends HasID<EdgeID> {
  id:        EdgeID;
  from:      ObjectID;
  to:        ObjectID;
  edgeType:  EdgeType;
  title:     string;
  tags:      string;
  summary:   string;
}

export const emptyEdge = {
  id:       '0',
  from:     '0',
  to:       '0',
  edgeType: EdgeType.NONE,
  title:    '',
  tags:     '',
  summary:  '',
};

export const isEmpty = (edge: Edge): boolean => equals(emptyEdge, edge);

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

const EDGE_TYPE = 'EDGE_TYPE';
export const edgeType =
  (type: EdgeType) => ({
    type: EDGE_TYPE as typeof EDGE_TYPE,
    payload: { edgeType: type },
  });

const EDGE_TITLE = 'EDGE_TITLE';
export const edgeTitle =
  (title: string) => ({
    type: EDGE_TITLE as typeof EDGE_TITLE,
    payload: { title },
  });

const EDGE_TAGS = 'EDGE_TAGS';
export const edgeTags =
  (tags: string) => ({
    type: EDGE_TAGS as typeof EDGE_TAGS,
    payload: { tags },
  });

const EDGE_SUMMARY = 'EDGE_SUMMARY';
export const edgeSummary =
  (summary: string) => ({
    type: EDGE_SUMMARY as typeof EDGE_SUMMARY,
    payload: { summary },
  });

export const actions = {
  edgeFrom,
  edgeTo,
  edgeType,
  edgeTitle,
  edgeTags,
  edgeSummary,
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
    case EDGE_TYPE: {
      return { ...state, edgeType: action.payload.edgeType };
    }
    case EDGE_TITLE: {
      return { ...state, title: action.payload.title };
    }
    case EDGE_TAGS: {
      return { ...state, tags: action.payload.tags };
    }
    case EDGE_SUMMARY: {
      return { ...state, summary: action.payload.summary };
    }
    default: {
      return state;
    }
  }
};
