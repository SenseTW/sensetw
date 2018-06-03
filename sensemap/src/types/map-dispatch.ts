import { Action, AnyAction } from 'redux';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';

interface PlainActionCreator<A extends Action> {
  // tslint:disable-next-line:no-any
  <T extends A>(...args: any[]): T;
}

interface ThunkActionCreator<S, E, A extends Action> {
  // tslint:disable-next-line:no-any
  (...args: any[]): ThunkAction<any, S, E, A>;
}

type ActionCreator<S, E, A extends Action>
  = PlainActionCreator<A>
  | ThunkActionCreator<S, E, A>
  ;

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
 * @todo Tell the difference between `PlainActionCreator` and `ThunkActionCreator`.
 */
export function mapDispatch<T, S, E = {}, A extends Action = AnyAction>
  (o: T | ActionCreator<S, E, A>) {
    return function (dispatch: ThunkDispatch<S, E, A>) {
      switch (typeof o) {
        case 'object': {
          const object = o as T;
          // tslint:disable-next-line:no-any
          let ret: any = {};
          for (let key in object) {
            if (o.hasOwnProperty(key)) {
              const nextmap = object[key] as T[keyof T];
              ret[key] = mapDispatch(nextmap)(dispatch);
            }
          }
          return ret;
        }
        case 'function': {
          const action = o as ActionCreator<S, E, A>;
          // tslint:disable-next-line:no-any
          return function(...args: any[]) {
            // XXX: should pass `this` instead of `undefined`
            return dispatch(action.apply(undefined, args));
          };
        }
        default:
          return o;
      }
    };
  }