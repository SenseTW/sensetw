import * as React from 'react';
import { connect } from 'react-redux';
import * as T from '../../types';
import { Key } from 'ts-keycode-enum';

interface StateFromProps {}
interface DispatchFromProps {
  actions: {
    keyPress(key: Key): T.ActionChain,
    keyRelease(key: Key): T.ActionChain,
  };
}
interface OwnProps {}

type Props = StateFromProps & DispatchFromProps & OwnProps;

class KeyboardInput extends React.Component<Props> {
  handleKeyUp = (e: KeyboardEvent) => {
    const { actions } = this.props;
    actions.keyRelease(e.which);
  }

  handleKeyDown = (e: KeyboardEvent) => {
    const { actions } = this.props;
    actions.keyPress(e.which);
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  render() {
    return null;
  }
}

export default connect<StateFromProps, DispatchFromProps, OwnProps>(
  (state: T.State) => ({}),
  (dispatch: T.Dispatch) => ({
    actions: {
      keyPress: (key: Key) =>
        dispatch(T.actions.input.keyPress(key)),
      keyRelease: (key: Key) =>
        dispatch(T.actions.input.keyRelease(key)),
    },
  }),
)(KeyboardInput);
