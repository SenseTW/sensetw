import { ActionUnion, emptyAction } from './action';

export type State = {
    username: string,
    password: string,
    email: string
};

export const initial: State = {
    username: '',
    password: '',
    email: ''
};

const UPDATE_USERNAME = 'UPDATE_USERNAME';
const updateUsername =
  (username: string) => ({
    type: UPDATE_USERNAME as typeof UPDATE_USERNAME,
    payload: { username}
  });

const UPDATE_PASSWORD = 'UPDATE_PASSWORD';
const updatePassword =
  (password: string) => ({
    type: UPDATE_PASSWORD as typeof UPDATE_PASSWORD,
    payload: { password },
  });

const UPDATE_EMAIL = 'UPDATE_EMAIL';
const updateEmail = 
  (email: string) => ({
    type: UPDATE_EMAIL as typeof UPDATE_EMAIL,
    payload: { email },
});

export const actions = {
    updateUsername,
    updatePassword,
    updateEmail
};

export type Action = ActionUnion<typeof actions>;

export const reducer = (state: State = initial, action: Action = emptyAction) => {
  switch (action.type) {
    case UPDATE_USERNAME: {
      const { username } = action.payload;
      return {
        ...state, username 
      };
    }
    case UPDATE_PASSWORD: {
      const { password } = action.payload;
      return {
        ...state, password
      };
    }
    case UPDATE_EMAIL: {
      const { email} = action.payload;
      return {
        ...state, email
      };
    }
    default: return state;
  }
};