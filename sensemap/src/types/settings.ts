import { Dispatch, GetState } from '.';
import { ActionUnion, emptyAction } from './action';
import * as U from './graphql/user';

const enum PasswordType {
  OLD = 'OLD',
  NEW = 'NEW',
  CONFIRM = 'CONFIRM',
}

export const enum PasswordStatus {
  NONE = 'NONE',
  SUCCESS = 'SUCCESS',
  OLD_PASSWORD_WRONG = 'OLD_PASSWORD_WRONG',
  NEW_PASSWORD_INVALID = 'NEW_PASSWORD_INVALID',
}

export type State = {
  [PasswordType.OLD]: string;
  [PasswordType.NEW]: string;
  [PasswordType.CONFIRM]: string;
  passwordStatus: PasswordStatus;
};

export const initial: State = {
  [PasswordType.OLD]: '',
  [PasswordType.NEW]: '',
  [PasswordType.CONFIRM]: '',
  passwordStatus: PasswordStatus.NONE,
};

const UPDATE_PASSWORD = 'UPDATE_PASSWORD';
const updatePassword =
  (password: string, type: PasswordType) => ({
    type: UPDATE_PASSWORD as typeof UPDATE_PASSWORD,
    payload: { password, type },
  });

const updateOldPassword =
  (password: string) =>
    updatePassword(password, PasswordType.OLD);

const updateNewPassword =
  (password: string) =>
    updatePassword(password, PasswordType.NEW);

const updateConfirmPassword =
  (password: string) =>
    updatePassword(password, PasswordType.CONFIRM);

const UPDATE_PASSWORD_STATUS = 'UPDATE_PASSWORD_STATUS';
const updatePasswordStatus =
  (passwordStatus: PasswordStatus) => ({
    type: UPDATE_PASSWORD_STATUS as typeof UPDATE_PASSWORD_STATUS,
    payload: { passwordStatus },
  });

export const getOldPassword =
  (state: State) =>
    state[PasswordType.OLD];

export const getNewPassword =
  (state: State) =>
    state[PasswordType.NEW];

export const getConfirmPassword =
  (state: State) =>
    state[PasswordType.CONFIRM];

export const getPasswordStatus =
  (state: State) =>
    state.passwordStatus;

export const submitNewPassword =
  () =>
  async (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const { session: { user }, settings } = state;
    const oldPassword = getOldPassword(settings);
    const newPassword = getNewPassword(settings);

    const r0 = await U.verifyPassword(user, oldPassword);
    if (!r0) {
      return dispatch(updatePasswordStatus(PasswordStatus.OLD_PASSWORD_WRONG));
    }
    const r1 = await U.updatePassword(user, newPassword);
    if (!r1) {
      return dispatch(updatePasswordStatus(PasswordStatus.NEW_PASSWORD_INVALID));
    }
    return dispatch(updatePasswordStatus(PasswordStatus.SUCCESS));
  };

export const syncActions = {
  updateOldPassword,
  updateNewPassword,
  updateConfirmPassword,
  updatePasswordStatus,
};

export const actions = {
  ...syncActions,
  submitNewPassword,
};

export type Action = ActionUnion<typeof syncActions>;

export const reducer = (state: State = initial, action: Action = emptyAction) => {
  switch (action.type) {
    case UPDATE_PASSWORD: {
      const { password, type } = action.payload;
      return {
        ...state,
        [type]: password,
      };
    }
    case UPDATE_PASSWORD_STATUS: {
      const { passwordStatus } = action.payload;
      // Clear password fields in any status change
      return {
        ...initial,
        passwordStatus,
      };
    }
    default: return state;
  }
};
