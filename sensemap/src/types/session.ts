import { State, sessionReducer } from 'redux-react-session';
import * as U from './sense/user';

export interface User extends U.UserData {
  access_token: string;
  refresh_token: string;
}

export const anonymousUser = {
  ...U.anonymousUserData,
  access_token: '',
  refresh_token: '',
};

export type State = State;

export const inital: State = {
  checked: false,
  authenticated: false,
  invalid: false,
  user: anonymousUser,
};

export const reducer = sessionReducer;
