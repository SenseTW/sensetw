import * as React from 'react';
import { connect } from 'react-redux';
import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';
import './index.css';
import { actions, ActionProps, State, mapDispatch } from '../../types';
import * as V from '../../types/viewport';

type StateFromProps = {
  isMobile: boolean,
};

// tslint:disable:no-any
type Props = StateFromProps & ActionProps;

/**
 * The header contains a main menu with a submenu.
 */
class Header extends React.PureComponent<Props> {
  render() {
    return this.props.isMobile
      ? <MobileHeader />
      : <DesktopHeader />;
  }
}

export default connect<StateFromProps, ActionProps>(
  (state: State) => {
    const { viewport } = state;
    const isMobile = V.isMobile(viewport);
    return { isMobile };
  },
  mapDispatch({actions})
)(Header);
