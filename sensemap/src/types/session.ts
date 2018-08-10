import { State, sessionReducer } from 'redux-react-session';

export type User = {
    id?: string,
    email?: string,
    username?: string,
};

export type State = State;

export const inital: State = {
    checked: false,
    authenticated: false,
    invalid: false,
    user: {}
};

export const reducer = sessionReducer;