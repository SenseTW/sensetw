import { Reducer as ReduxReducer, combineReducers } from 'redux';
import { emptyAction } from './action';
import { State } from './map-dispatch';
import * as SM from './sense-map';
import * as SO from './sense-object';
import * as SL from './selection';
import * as OE from './object-editor';
import * as V  from './viewport';
import * as SG from './stage';
import * as I  from './input';
import * as IP from './importer';

export { State, Dispatch, mapDispatch } from './map-dispatch';

export type ActionChain = Action | Promise<Action>;

export type GetState = () => State;

export type Reducer = ReduxReducer<State>;

export const initial = {
  senseMap:    SM.initial,
  senseObject: SO.initial,
  selection:   SL.initial,
  editor:      OE.initial,
  input:        I.initial,
  viewport:     V.initial,
  stage:       SG.initial,
  importer:    IP.initial,
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
  | IP.Action
  ;

export const actions = {
  senseMap:    SM.actions,
  senseObject: SO.actions,
  selection:   SL.actions,
  editor:      OE.actions,
  input:        I.actions,
  viewport:     V.actions,
  stage:       SG.actions,
  importer:    IP.actions,
};

export type ActionProps = {
  actions: typeof actions,
};

export const reducer = combineReducers({
  senseMap:    SM.reducer,
  senseObject: SO.reducer,
  selection:   SL.reducer,
  editor:      OE.reducer,
  input:        I.reducer,
  viewport:     V.reducer,
  stage:       SG.reducer,
  importer:    IP.reducer,
});
