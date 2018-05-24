import { Dispatch, GetState } from '.';
import { ActionUnion, emptyAction } from './action';
import * as HasID from './sense/has-id';
import { ObjectType } from './sense/object';
import { BoxID, BoxData, Action as BoxAction, emptyBoxData, reducer as boxReducer } from './sense/box';
import { CardID, CardData, Action as CardAction, emptyCardData, reducer as cardReducer } from './sense/card';
import * as F from './sense/focus';
import * as SO from './sense-object';
import { clone } from 'ramda';

export enum StatusType {
  HIDE = 'SIDEBAR_HIDE',
  SHOW = 'SIDEBAR_SHOW',
}

const SNAPSHOT_OBJECT = 'SNAPSHOT_OBJECT';
const snapshotObject =
  (objectType: ObjectType, data: CardData | BoxData) => ({
    type: SNAPSHOT_OBJECT as typeof SNAPSHOT_OBJECT,
    payload: { objectType, data },
  });

const CLEAR_OBJECT = 'CLEAR_OBJECT';
const clearObject =
  (objectType: ObjectType, id: CardID | BoxID) => ({
    type: CLEAR_OBJECT as typeof CLEAR_OBJECT,
    payload: { objectType, id },
  });

const CHANGE_STATUS = 'CHANGE_STATUS';
const changeStatus =
  (status: StatusType) => ({
    type: CHANGE_STATUS as typeof CHANGE_STATUS,
    payload: { status },
  });

const FOCUS_OBJECT = 'FOCUS_OBJECT';
const focusObject =
  (focus: F.Focus) => ({
    type: FOCUS_OBJECT as typeof FOCUS_OBJECT,
    payload: { focus },
  });

const UPDATE_EDITOR_CARD = 'UPDATE_EDITOR_CARD';
const updateEditorCard =
  (id: CardID, action: CardAction) => ({
    type: UPDATE_EDITOR_CARD as typeof UPDATE_EDITOR_CARD,
    payload: { id, action },
  });

const updateCard =
  (id: CardID, action: CardAction) =>
  (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    let card = SO.getCard(state.editor.temp, id);

    if (card.id === emptyCardData.id) {
      card = SO.getCard(state.senseObject, id);
      dispatch(snapshotObject(ObjectType.CARD, card));
    }

    return Promise.resolve(dispatch(updateEditorCard(id, action)));
  };

const UPDATE_EDITOR_BOX = 'UPDATE_EDITOR_BOX';
const updateEditorBox =
  (id: BoxID, action: BoxAction) => ({
    type: UPDATE_EDITOR_BOX as typeof UPDATE_EDITOR_BOX,
    payload: { id, action },
  });

const updateBox =
  (id: BoxID, action: BoxAction) =>
  (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    let box = SO.getBox(state.editor.temp, id);

    if (box.id === emptyBoxData.id) {
      box = SO.getBox(state.senseObject, id);
      dispatch(snapshotObject(ObjectType.BOX, box));
    }

    return Promise.resolve(dispatch(updateEditorBox(id, action)));
  };

export const syncActions = {
  snapshotObject,
  clearObject,
  changeStatus,
  focusObject,
  updateEditorCard,
  updateEditorBox,
};

export const actions = {
  ...syncActions,
  updateCard,
  updateBox,
};

export type Action = ActionUnion<typeof syncActions>;

export type State = {
  status: StatusType,
  temp: SO.State,
  focus: F.Focus,
};

export const initial: State = {
  status: StatusType.HIDE,
  temp: SO.reducer(),
  focus: F.focusNothing(),
};

export const getFocusedObject = (state: State): CardData | BoxData | null => {
  const { focus } = state;

  switch (focus.objectType) {
    case ObjectType.BOX:  return SO.getBox(state.temp, focus.data);
    case ObjectType.CARD: return SO.getCard(state.temp, focus.data);
    default:              return null;
  }
};

export const reducer = (state: State = initial, action: Action = emptyAction) => {
  switch (action.type) {
    case SNAPSHOT_OBJECT: {
      const { objectType, data } = action.payload;

      // use the sense-object reducer to update our object map
      let { temp } = state;
      switch (objectType) {
        case ObjectType.BOX:
          temp = SO.reducer(temp, SO.actions.updateBoxes(HasID.toIDMap<BoxID, BoxData>([data as BoxData])));
          break;
        case ObjectType.CARD:
          temp = SO.reducer(temp, SO.actions.updateCards(HasID.toIDMap<CardID, CardData>([data as CardData])));
          break;
        default:
      }

      return { ...state, temp };
    }
    case CLEAR_OBJECT: {
      const { objectType, id } = action.payload;

      let temp = clone(state.temp);
      switch (objectType) {
        case ObjectType.BOX:
          delete temp.boxes[id];
          break;
        case ObjectType.CARD:
          delete temp.cards[id];
          break;
        default:
      }

      return { ...state, temp };
    }
    case CHANGE_STATUS: {
      const { status } = action.payload;

      return { ...state, status };
    }
    case FOCUS_OBJECT: {
      const { focus } = action.payload;

      return { ...state, focus };
    }
    case UPDATE_EDITOR_CARD: {
      const { id, action: act } = action.payload;
      const { temp } = state;

      return {
        ...state,
        temp: {
          ...temp,
          cards: {
            ...temp.cards,
            [id]: cardReducer(SO.getCard(temp, id), act)
          }
        }
      };
    }
    case UPDATE_EDITOR_BOX: {
      const { id, action: act } = action.payload;
      const { temp } = state;

      return {
        ...state,
        temp: {
          ...temp,
          boxes: {
            ...temp.boxes,
            [id]: boxReducer(SO.getBox(temp, id), act)
          }
        }
      };
    }
    default:
      return state;
  }
};
