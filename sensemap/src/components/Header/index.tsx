import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Menu, Icon } from 'semantic-ui-react';
import Breadcrumb from './Breadcrumb';
import Submenu from './Submenu';
import { State } from '../../types';
import * as SM from '../../types/sense/map';
import * as R from '../../types/routes';
import * as CS from '../../types/cached-storage';
import './index.css';
import { actions, ActionProps, mapDispatch } from '../../types';
import AccountMenuItem from './AccountMenuItem';
const logo = require('./logo.png');

type StateFromProps = {
  map: SM.MapData,
};

// tslint:disable:no-any
type Props = StateFromProps & ActionProps & RouteComponentProps<any>;

/**
 * The header contains a main menu with a submenu.
 */
class Header extends React.PureComponent<Props> {
  render() {
    const { actions: acts } = this.props;

    return (
      <div className="sense-header">
        <Menu inverted>
          <Menu.Item
            id="sense-header__home-btn"
            as={Link}
            to={R.index}
          >
            <img src={logo} />
          </Menu.Item>
          <Menu.Item
            id="sense-header__about-btn"
            as="a"
            href="https://about.sense.tw/"
            target="_blank"
            rel="noopener noreferrer"
          >
            About
          </Menu.Item>
          <Menu.Item
            id="sense-header__dashboard-btn"
            as={Link}
            to={R.mapList}
          >
            Dashboard
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item
              id="sense-header__help-btn"
              as="a"
              href="https://help.sense.tw/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="question circle outline" size="large" />
            </Menu.Item>
            <AccountMenuItem />
          </Menu.Menu>
        </Menu>
        <div className="sense-header__submenu">
          <Breadcrumb />
          <Submenu
            map={this.props.map}
            onEditMap={(m: SM.MapData) => acts.editor.focusMap(m.id)}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(connect<StateFromProps, ActionProps>(
  (state: State) => {
    const { senseMap, senseObject } = state;
    return { map: CS.getMap(senseObject, senseMap.map) };
  },
  mapDispatch({actions})
)(Header));
