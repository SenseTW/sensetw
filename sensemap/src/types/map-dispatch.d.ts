import { Dispatch } from '.';

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
 */
export declare const mapDispatch: <T>(obj: T) => (dispatch: Dispatch) => T;