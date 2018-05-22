import { Dispatch, GetState } from '.';
import { ActionUnion, emptyAction } from './action';
import * as SO from './sense-object';
import * as SB from './sense-box';
import * as SC from './sense-card';
import { clone } from 'ramda';

export enum StatusType {
  HIDE   = 'SIDEBAR_HIDE',
  CREATE = 'SIDEBAR_CREATE',
  EDIT   = 'SIDEBAR_EDIT',
}

const SNAPSHOT_OBJECT = 'SNAPSHOT_OBJECT';
const snapshotObject =
  (objectType: SO.ObjectType, data: SC.CardData | SB.BoxData) => ({
    type: SNAPSHOT_OBJECT as typeof SNAPSHOT_OBJECT,
    payload: { objectType, data },
  });

const CLEAR_OBJECT = 'CLEAR_OBJECT';
const clearObject =
  (objectType: SO.ObjectType, id: SC.CardID | SB.BoxID) => ({
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
  (focus: SO.ObjectID | null) => ({
    type: FOCUS_OBJECT as typeof FOCUS_OBJECT,
    payload: { focus },
  });

const UPDATE_EDITOR_CARD = 'UPDATE_EDITOR_CARD';
const updateEditorCard =
  (id: SC.CardID, action: SC.Action) => ({
    type: UPDATE_EDITOR_CARD as typeof UPDATE_EDITOR_CARD,
    payload: { id, action },
  });

const updateCard =
  (id: SC.CardID, action: SC.Action) =>
  (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    let card = SO.getCard(state.editor.temp, id);

    if (card.id === SC.emptyCardData.id) {
      card = SO.getCard(state.senseObject, id);
      dispatch(snapshotObject(SO.ObjectType.CARD, card));
    }

    return Promise.resolve(dispatch(updateEditorCard(id, action)));
  };

const UPDATE_EDITOR_BOX = 'UPDATE_EDITOR_BOX';
const updateEditorBox =
  (id: SB.BoxID, action: SB.Action) => ({
    type: UPDATE_EDITOR_BOX as typeof UPDATE_EDITOR_BOX,
    payload: { id, action },
  });

const updateBox =
  (id: SB.BoxID, action: SB.Action) =>
  (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    let box = SO.getBox(state.editor.temp, id);

    if (box.id === SB.emptyBoxData.id) {
      box = SO.getBox(state.senseObject, id);
      dispatch(snapshotObject(SO.ObjectType.BOX, box));
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
  focus: SO.ObjectID | null,
  temp: SO.State,
};

export const initial: State = {
  status: StatusType.HIDE,
  focus: null,
  temp: SO.reducer(),
};

export const getFocusedObject = (state: State): { object?: SO.ObjectData, data?: SC.CardData | SB.BoxData } => {
  if (state.focus === null) {
    return {};
  }

  const object = SO.getObject(state.temp, state.focus);

  switch (object.objectType) {
    case SO.ObjectType.BOX: {
      const data = SO.getBox(state.temp, object.data);
      return { object, data };
    }
    case SO.ObjectType.CARD: {
      const data = SO.getCard(state.temp, object.data);
      return { object, data };
    }
    default:
      return {};
  }
};

export const reducer = (state: State = initial, action: Action = emptyAction) => {
  switch (action.type) {
    case SNAPSHOT_OBJECT: {
      const { objectType, data } = action.payload;

      // use the sense-object reducer to update our object map
      let { temp } = state;
      switch (objectType) {
        case SO.ObjectType.BOX:
          temp = SO.reducer(temp, SO.actions.updateBoxes(SO.toIDMap<SB.BoxData>([data as SB.BoxData])));
          break;
        case SO.ObjectType.CARD:
          temp = SO.reducer(temp, SO.actions.updateCards(SO.toIDMap<SC.CardData>([data as SC.CardData])));
          break;
        default:
      }

      return { ...state, temp };
    }
    case CLEAR_OBJECT: {
      const { objectType, id } = action.payload;

      let temp = clone(state.temp);
      switch (objectType) {
        case SO.ObjectType.BOX:
          delete temp.boxes[id];
          break;
        case SO.ObjectType.CARD:
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
            [id]: SC.reducer(SO.getCard(temp, id), act)
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
            [id]: SB.reducer(SO.getBox(temp, id), act)
          }
        }
      };
    }
    default:
      return state;
  }
};
