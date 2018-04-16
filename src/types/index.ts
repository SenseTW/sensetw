import { Dispatch as ReduxDispatch, Reducer as ReduxReducer, combineReducers } from 'redux';
import * as C from './counter';
import * as S from './sense-map';

// tslint:disable-next-line:no-any
type FunctionType = (...args: any[]) => any;
type ActionCreatorsMap = { [actionCreator: string]: FunctionType };
export type ActionUnion<A extends ActionCreatorsMap> = ReturnType<A[keyof A]>;

export type State = {
  counter: C.State,
  senseMap: S.State
};

export const initial: State = {
  counter: C.initial,
  senseMap: S.initial
};

export type Action = ActionUnion<typeof C.actions> | ActionUnion<typeof S.actions>;

export const actions = {
  counter: C.actions,
  senseMap: S.actions
};

export type Dispatch = ReduxDispatch<Action>;

export type Reducer = ReduxReducer<State>;

export const reducer = combineReducers({
  counter: C.reducer,
  senseMap: S.reducer
});
