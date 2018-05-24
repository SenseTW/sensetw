import { Dispatch as ReduxDispatch, Reducer as ReduxReducer, combineReducers } from 'redux';
import { emptyAction } from './action';
import * as SM from './sense-map';
import * as SO from './sense-object';
import * as SL from './selection';
import * as OE from './object-editor';
import * as V  from './viewport';
import * as SG from './stage';
import * as I  from './input';

export { MapID, MapScopeType } from './sense-map';
export { ObjectID, ObjectType, ObjectData } from './sense/object';
export { BoxID, BoxData } from './sense/box';
export { CardID, CardType, CardData } from './sense/card';

export type State = {
  senseMap:    SM.State,
  senseObject: SO.State,
  selection:   SL.State,
  editor:      OE.State,
  input:        I.State,
  viewport:     V.State,
  stage:       SG.State,
};

export const initial: State = {
  senseMap:    SM.initial,
  senseObject: SO.initial,
  selection:   SL.initial,
  editor:      OE.initial,
  input:        I.initial,
  viewport:     V.initial,
  stage:       SG.initial,
};

export type Action
  = typeof emptyAction
  | SM.Action
  | SO.Action
  | SL.Action
  | OE.Action
  |  I.Action
  |  V.Action
  | SG.Action
  ;

export const actions = {
  senseMap:    SM.actions,
  senseObject: SO.actions,
  selection:   SL.actions,
  editor:      OE.actions,
  input:        I.actions,
  viewport:     V.actions,
  stage:       SG.actions,
};

export type ActionChain = Action | Promise<Action>;

export type Dispatch = ReduxDispatch<State>;

export type GetState = () => State;

export type Reducer = ReduxReducer<State>;

export const reducer = combineReducers({
  senseMap:    SM.reducer,
  senseObject: SO.reducer,
  selection:   SL.reducer,
  editor:      OE.reducer,
  input:        I.reducer,
  viewport:     V.reducer,
  stage:       SG.reducer,
});
