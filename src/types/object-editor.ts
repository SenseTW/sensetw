import { ActionUnion, emptyAction } from '.';
import * as SO from './sense-object';

export type State = {
  id: SO.ObjectID | null
};

export const initial: State = {
  id: null
};

const SELECT_OBJECT = 'SELECT_OBJECT';
const selectObject =
  (id: SO.ObjectID | null) => ({
    type: SELECT_OBJECT as typeof SELECT_OBJECT,
    payload: { id }
  });

export const actions = {
  selectObject
};

export type Action = ActionUnion<typeof actions>;

export const reducer = (state: State = initial, action: Action = emptyAction) => {
  switch (action.type) {
    case SELECT_OBJECT: {
      const { id } = action.payload;

      return {
        ...state,
        id
      };
    }
    default: {
      return state;
    }
  }
};