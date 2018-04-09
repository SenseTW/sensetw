import { Dispatch as ReduxDispatch, Reducer as ReduxReducer, combineReducers } from 'redux';
import * as C from './counter';

export type State = {
  counter: C.State
};

export const initial: State = {
  counter: C.initial
};

export type Action = C.Action;

export const actions = {
  counter: C.actions
};

export type Dispatch = ReduxDispatch<Action>;

export type Reducer = ReduxReducer<State>;

export const reducer = combineReducers({ counter: C.reducer });