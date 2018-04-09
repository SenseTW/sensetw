import * as React from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
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
      <Button.Group>
        <Button onClick={actions.increase}>+</Button>
        <Button>{counter}</Button>
        <Button onClick={actions.decrease}>-</Button>
      </Button.Group>
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