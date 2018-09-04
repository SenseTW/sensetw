import { State, sessionReducer } from 'redux-react-session';

export type User = {
  id?: string,
  email?: string,
  username?: string,
  access_token?: string,
  refresh_token?: string,
};

export type State = State;

export const inital: State = {
  checked: false,
  authenticated: false,
  invalid: false,
  user: {}
};

export const reducer = sessionReducer;
