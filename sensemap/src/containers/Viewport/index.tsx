// import * as React from 'react';
import { connect } from 'react-redux';
import * as T from '../../types';
import * as CO from '../../components/Viewport';

function Viewport(props: CO.Props) {
  return CO.Viewport(props);
}

export default connect<CO.StateFromProps, CO.DispatchFromProps>(
  (state: T.State) => state.viewport,
  (dispatch: T.Dispatch) => ({
    actions: {
      panViewport: (pos) =>
        dispatch(T.actions.viewport.panViewport(pos)),
    },
  }),
)(Viewport);
