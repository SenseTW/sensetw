import { ActionUnion, emptyAction } from '.';
import * as SO from './sense-object';
import * as SB from './sense-box';
import * as SC from './sense-card';

export enum StatusType {
  HIDE   = 'SIDEBAR_HIDE',
  CREATE = 'SIDEBAR_CREATE',
  EDIT   = 'SIDEBAR_EDIT',
}

type HideStatus = {
  type: StatusType.HIDE,
  objectType: SO.ObjectType.NONE,
  data: null,
};

// data constructors?
export const hide = (): HideStatus => ({
  type: StatusType.HIDE,
  objectType: SO.ObjectType.NONE,
  data: null,
});

type CreateBoxStatus = {
  type: StatusType.CREATE,
  objectType: SO.ObjectType.BOX,
  data: SB.BoxData,
};

export const createBox = (data: SB.BoxData): CreateBoxStatus => ({
  type: StatusType.CREATE,
  objectType: SO.ObjectType.BOX,
  data,
});

type EditBoxStatus = {
  type: StatusType.EDIT,
  objectType: SO.ObjectType.BOX,
  data: SB.BoxData,
};

export const editBox = (data: SB.BoxData): EditBoxStatus => ({
  type: StatusType.EDIT,
  objectType: SO.ObjectType.BOX,
  data,
});

type CreateCardStatus = {
  type: StatusType.CREATE,
  objectType: SO.ObjectType.CARD,
  data: SC.CardData,
};

export const createCard = (data: SC.CardData): CreateCardStatus => ({
  type: StatusType.CREATE,
  objectType: SO.ObjectType.CARD,
  data,
});

type EditCardStatus = {
  type: StatusType.EDIT,
  objectType: SO.ObjectType.CARD,
  data: SC.CardData,
};

export const editCard = (data: SC.CardData): EditCardStatus => ({
  type: StatusType.EDIT,
  objectType: SO.ObjectType.CARD,
  data,
});

export type Status
  = HideStatus
  | CreateBoxStatus
  | EditBoxStatus
  | CreateCardStatus
  | EditCardStatus;

const SELECT_OBJECT = 'SELECT_SIDEBAR_OBJECT';
export const selectObject =
  (status: Status) => ({
    type: SELECT_OBJECT as typeof SELECT_OBJECT,
    payload: { status },
  });

export const actions = {
  selectObject,
};

export type Action = ActionUnion<typeof actions>;

export type State = Status;

export const initial: State = {
  type: StatusType.HIDE,
  objectType: SO.ObjectType.NONE,
  data: null,
};

export const reducer = (state: State = initial, action: Action = emptyAction) => {
  switch (action.type) {
    case SELECT_OBJECT: {
      const { status } = action.payload;
      return status;
    }
    default:
      return state;
  }
};
