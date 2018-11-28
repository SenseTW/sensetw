import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { RouteComponentProps, Link } from 'react-router-dom';
import { Menu, Icon } from 'semantic-ui-react';
import Breadcrumb from './Breadcrumb';
import Submenu from './Submenu';
import AccountMenuItem from './AccountMenuItem';
import { actions, ActionProps, State, mapDispatch } from '../../../types';
import * as R from '../../../types/routes';
import * as SM from '../../../types/sense/map';
import * as CS from '../../../types/cached-storage';
const logo = require('../logo.png');

export const height = 95;

type StateFromProps = {
  map: SM.MapData,
};

// tslint:disable:no-any
type Props = StateFromProps & ActionProps & RouteComponentProps<any>;

class DesktopHeader extends React.PureComponent<Props> {
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
            onEditMap={(m: SM.MapData) => acts.senseMap.toggleEditor(true)}
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
  mapDispatch({ actions })
)(DesktopHeader));