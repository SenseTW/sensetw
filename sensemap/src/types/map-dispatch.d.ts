import { Dispatch as ReduxDispatch, combineReducers } from 'redux';
import * as SM from './sense-map';
import * as SO from './sense-object';
import * as SL from './selection';
import * as OE from './object-editor';
import * as V  from './viewport';
import * as SG from './stage';
import * as I  from './input';
import * as IP from './importer';

export type State = {
  senseMap:    SM.State,
  senseObject: SO.State,
  selection:   SL.State,
  editor:      OE.State,
  input:        I.State,
  viewport:     V.State,
  stage:       SG.State,
  importer:    IP.State,
};

export type Dispatch = ReduxDispatch<State>;

/**
 * This function applies the dispatch function to every functions in the given object without
 * changing their types.
 *
 * Use a js file with a declare file to work-around the type system.
 *
 * Usage:
 *
 * ```
 * import * as React from 'react';
 * import { ActionProps, actions, mapDispatch } from '../../types';
 *
 * class Component extends React.PureComponent<Props & ActionProps> {}
 *
 * export default connect(
 *  state => ({}),
 *  mapDispatch({ actions })
 * )(Component);
 * ```
 *
 * @todo Fix thunk action types. They should be
 * `(...args: Args) => Promise<B>` instead of
 * `(...args: Args) => (Dispatch) => Promise<B>` after we map the dispatch
 * function.
 */
export declare const mapDispatch: <T>(obj: T) => (dispatch: Dispatch) => T;