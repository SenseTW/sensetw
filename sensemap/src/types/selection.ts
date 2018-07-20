import { ActionUnion } from './action';
import { BoundingBox, emptyBoundingBox } from '../graphics/drawing';
import { ObjectID } from './sense/object';

const ADD_OBJECT_TO_SELECTION = 'ADD_OBJECT_TO_SELECTION';
const addObjectToSelection = (id: ObjectID) => ({
  type: ADD_OBJECT_TO_SELECTION as typeof ADD_OBJECT_TO_SELECTION,
  payload: id,
});

const REMOVE_OBJECT_FROM_SELECTION = 'REMOVE_OBJECT_FROM_SELECTION';
const removeObjectFromSelection = (id: ObjectID) => ({
  type: REMOVE_OBJECT_FROM_SELECTION as typeof REMOVE_OBJECT_FROM_SELECTION,
  payload: id,
});

const TOGGLE_OBJECT_SELECTION = 'TOGGLE_OBJECT_SELECTION';
const toggleObjectSelection = (id: ObjectID) => ({
  type: TOGGLE_OBJECT_SELECTION as typeof TOGGLE_OBJECT_SELECTION,
  payload: id,
});

const SET_BOUNDING_BOX = 'SET_BOUNDING_BOX';
const setBoundingBox = (boundingBox: BoundingBox) => ({
  type: SET_BOUNDING_BOX as typeof SET_BOUNDING_BOX,
  payload: { boundingBox },
});

const CLEAR_SELECTION = 'CLEAR_SELECTION';
const clearSelection = () => ({
  type: CLEAR_SELECTION as typeof CLEAR_SELECTION,
});

export const actions = {
  addObjectToSelection,
  removeObjectFromSelection,
  toggleObjectSelection,
  setBoundingBox,
  clearSelection,
};

export type Action = ActionUnion<typeof actions>;

export type State = {
  objects: ObjectID[],
  boundingBox: BoundingBox,
};
export const initial: State = {
  objects: [],
  boundingBox: emptyBoundingBox,
};

export const contains = (selection: State, id: ObjectID): Boolean =>
  selection.objects.indexOf(id) >= 0;

export const get = (selection: State, index: number): ObjectID =>
  selection.objects[index];

export const count = (selection: State): number =>
  selection.objects.length;

export const reducer = (state: State = initial, action: Action): State => {
  switch (action.type) {
    case ADD_OBJECT_TO_SELECTION: {
      const id = action.payload;
      if (state.objects.indexOf(id) >= 0) {
        return state;
      } else {
        return { ...state, objects: [...state.objects, id] };
      }
    }
    case REMOVE_OBJECT_FROM_SELECTION: {
      const id = action.payload;
      const i = state.objects.indexOf(id);
      if (i >= 0) {
        return {
          ...state,
          objects: [...state.objects.slice(0, i), ...state.objects.slice(i + 1)],
        };
      } else {
        return state;
      }
    }
    case TOGGLE_OBJECT_SELECTION: {
      const id = action.payload;
      const i = state.objects.indexOf(id);
      if (i >= 0) {
        return {
          ...state,
          objects: [...state.objects.slice(0, i), ...state.objects.slice(i + 1)],
        };
      } else {
        return {
          ...state,
          objects: [...state.objects, id],
        };
      }
    }
    case CLEAR_SELECTION: {
      return {
        ...state,
        objects: [],
      };
    }
    default: {
      return state;
    }
  }
};
