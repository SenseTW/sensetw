import { ActionUnion } from './action';
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

const CLEAR_SELECTION = 'CLEAR_SELECTION';
const clearSelection = () => ({
  type: CLEAR_SELECTION as typeof CLEAR_SELECTION,
});

export const actions = {
  addObjectToSelection,
  removeObjectFromSelection,
  toggleObjectSelection,
  clearSelection,
};

export type Action = ActionUnion<typeof actions>;

export type State = ObjectID[];
export const initial: State = [];

export const contains = (selection: State, id: ObjectID): Boolean =>
  selection.indexOf(id) >= 0;

export const reducer = (state: State = initial, action: Action): State => {
  switch (action.type) {
    case ADD_OBJECT_TO_SELECTION: {
      const id = action.payload;
      if (state.indexOf(id) >= 0) {
        return state;
      } else {
        return [...state, id];
      }
    }
    case REMOVE_OBJECT_FROM_SELECTION: {
      const id = action.payload;
      const i = state.indexOf(id);
      if (i >= 0) {
        return [...state.slice(0, i), ...state.slice(i + 1)];
      } else {
        return state;
      }
    }
    case TOGGLE_OBJECT_SELECTION: {
      const id = action.payload;
      const i = state.indexOf(id);
      if (i >= 0) {
        return [...state.slice(0, i), ...state.slice(i + 1)];
      } else {
        return [...state, id];
      }
    }
    case CLEAR_SELECTION: {
      return [];
    }
    default: {
      return state;
    }
  }
};
