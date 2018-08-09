import { State, sessionReducer } from 'redux-react-session';

export type State = State;

export const inital: State = {
    checked: false,
    authenticated: false,
    invalid: false,
    user: {}
};

export const isAuthenticated = (state: State): boolean => true;

export const reducer = sessionReducer;