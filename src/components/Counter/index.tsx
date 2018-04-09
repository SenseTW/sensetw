import * as React from 'react';
import { connect } from 'react-redux';
import * as T from '../../types';

interface StateFromProps {
  counter: number;
}

interface DispatchFromProps {
  actions: {
    increase: () => T.Action,
    decrease: () => T.Action
  };
}

type Props = StateFromProps & DispatchFromProps;

class Counter extends React.PureComponent<Props> {
  render() {
    const { actions, counter } = this.props;

    return (
      <div>
        <button onClick={actions.increase}>+</button>
        {counter}
        <button onClick={actions.decrease}>-</button>
      </div>
    );
  }
}

export default connect<StateFromProps, DispatchFromProps>(
  (state: T.State) => state.counter,
  (dispatch: T.Dispatch) => ({
    actions: {
      increase: () => dispatch(T.actions.counter.increase()),
      decrease: () => dispatch(T.actions.counter.decrease())
    }
  })
)(Counter);