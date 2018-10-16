import { ActionUnion, emptyAction } from './action';

export enum StatusType {
  HIDE = 'SIDEBAR_HIDE',
  SHOW = 'SIDEBAR_SHOW',
}

const CHANGE_STATUS = 'CHANGE_STATUS';
const changeStatus =
  (status: StatusType) => ({
    type: CHANGE_STATUS as typeof CHANGE_STATUS,
    payload: { status },
  });

export const actions = {
  changeStatus,
};

export type Action = ActionUnion<typeof actions>;

export type State = {
  status: StatusType,
};

export const initial: State = {
  status: StatusType.HIDE,
};

export const reducer = (state: State = initial, action: Action = emptyAction) => {
  switch (action.type) {
    case CHANGE_STATUS: {
      const { status } = action.payload;

      return { ...state, status };
    }
    default:
      return state;
  }
};
