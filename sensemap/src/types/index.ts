import { Dispatch as ReduxDispatch, Reducer as ReduxReducer, combineReducers } from 'redux';
import * as C from './counter';
import * as SM from './sense-map';
import * as SO from './sense-object';
import * as SC from './sense-card';
import * as SL from './selection';
import * as OE from './object-editor';

export { MapID, MapScopeType } from './sense-map';
export { ObjectID, ObjectType, ObjectData } from './sense-object';
export { CardID, CardType, CardData } from './sense-card';
export { BoxID, BoxData } from './sense-box';

export const emptyAction = { type: null };
// tslint:disable-next-line:no-any
type FunctionType = (...args: any[]) => any;
type ActionCreatorsMap = { [actionCreator: string]: FunctionType };
export type ActionUnion<A extends ActionCreatorsMap> = typeof emptyAction | ReturnType<A[keyof A]>;

export type State = {
  counter: C.State,
  senseMap: SM.State,
  senseObject: SO.State,
  selection: SL.State,
  editor: OE.State,
};

export const initial: State = {
  counter: C.initial,
  senseMap: SM.initial,
  senseObject: SO.initial,
  selection: SL.initial,
  editor: OE.initial,
};

export type Action
  = ActionUnion<typeof C.actions>
  | SM.Action
  | SO.Action
  | SC.Action
  | SL.Action
  | OE.Action;

export type ActionChain = Action | Promise<Action>;

export const actions = {
  counter: C.actions,
  senseMap: SM.actions,
  senseObject: SO.actions,
  selection: SL.actions,
  editor: OE.actions,
};

export type Dispatch = ReduxDispatch<State>;

export type GetState = () => State;

export type Reducer = ReduxReducer<State>;

export const reducer = combineReducers({
  counter: C.reducer,
  senseMap: SM.reducer,
  senseObject: SO.reducer,
  selection: SL.reducer,
  editor: OE.reducer,
});
