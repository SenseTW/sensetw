import { Dispatch as ReduxDispatch, Reducer as ReduxReducer, combineReducers } from 'redux';
import { emptyAction } from './action';
import * as SS from './session';
import * as A  from './account';
import * as SM from './sense-map';
import * as CS from './cached-storage';
import * as SO from './sense-object';
import * as SL from './selection';
import * as OE from './object-editor';
import * as V  from './viewport';
import * as SG from './stage';
import * as I  from './input';
import * as S from './settings';
import * as IP from './importer';

export { mapDispatch } from './map-dispatch';

export type State = {
  session:     SS.State,
  account:     A.State,
  senseMap:    SM.State,
  senseObject: SO.State,
  selection:   SL.State,
  editor:      OE.State,
  input:        I.State,
  viewport:     V.State,
  stage:       SG.State,
  settings:    S.State,
  importer:    IP.State,
};

export type ActionChain = Action | Promise<Action>;

export type Dispatch = ReduxDispatch<Action>;

export type GetState = () => State;

export type Reducer = ReduxReducer<State>;

export const initial = {
  session:        SS.inital,
  account:        A.initial,
  senseMap:       SM.initial,
  senseObject:    SO.initial,
  selection:      SL.initial,
  editor:         OE.initial,
  input:          I.initial,
  viewport:       V.initial,
  stage:          SG.initial,
  settings:       S.initial,
  importer:       IP.initial
};

export type Action
  = typeof emptyAction
  | SM.Action
  | A.Action
  | CS.Action
  | SO.Action
  | SL.Action
  | OE.Action
  |  I.Action
  |  V.Action
  | SG.Action
  |  S.Action
  | IP.Action
  ;

export const actions = {
  account:       A.actions,
  senseMap:      SM.actions,
  // senseObject also handles cachedStorage actions
  cachedStorage: CS.actions,
  senseObject:   SO.actions,
  selection:     SL.actions,
  editor:        OE.actions,
  input:          I.actions,
  viewport:       V.actions,
  stage:         SG.actions,
  settings:       S.actions,
  importer:      IP.actions,
};

export type ActionProps = { actions: typeof actions };

export const reducer = combineReducers({
  session:       SS.reducer,
  account:       A.reducer,
  senseMap:      SM.reducer,
  senseObject:   SO.reducer,
  selection:     SL.reducer,
  editor:        OE.reducer,
  input:         I.reducer,
  viewport:      V.reducer,
  stage:         SG.reducer,
  settings:      S.reducer,
  importer:      IP.reducer,
});
