import { ActionUnion, emptyAction } from './action';

enum PasswordType {
  OLD = 'OLD',
  NEW = 'NEW',
  CONFIRM = 'CONFIRM',
}

export type State = {
  [PasswordType.OLD]: string;
  [PasswordType.NEW]: string;
  [PasswordType.CONFIRM]: string;
};

export const initial: State = {
  [PasswordType.OLD]: '',
  [PasswordType.NEW]: '',
  [PasswordType.CONFIRM]: '',
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

export const getOldPassword =
  (state: State) =>
    state[PasswordType.OLD];

export const getNewPassword =
  (state: State) =>
    state[PasswordType.NEW];

export const getConfirmPassword =
  (state: State) =>
    state[PasswordType.CONFIRM];

export const actions = {
  updateOldPassword,
  updateNewPassword,
  updateConfirmPassword,
};

export type Action = ActionUnion<typeof actions>;

export const reducer = (state: State = initial, action: Action = emptyAction) => {
  switch (action.type) {
    case UPDATE_PASSWORD: {
      const { password, type } = action.payload;
      return {
        ...state,
        [type]: password,
      };
    }
    default: return state;
  }
};