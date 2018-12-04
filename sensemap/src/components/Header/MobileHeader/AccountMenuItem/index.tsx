import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import * as copy from 'copy-to-clipboard';
import { State, ActionProps, mapDispatch, actions } from '../../../../types';
import * as R from '../../../../types/routes';
import * as SM from '../../../../types/sense/map';
import * as CS from '../../../../types/cached-storage';

interface StateFromProps {
  authenticated: boolean;
  map: SM.MapData;
}

type Props = StateFromProps & ActionProps & RouteComponentProps<{}>;

class AccountMenuItem extends React.PureComponent<Props> {
  render() {
    const { actions: acts, map } = this.props;
    const inMap = !SM.isEmpty(map);

    return (
      <Dropdown
        item
        icon="ellipsis horizontal"
      >
        <Dropdown.Menu>
          { inMap &&
            <Dropdown.Item
              id="sense-mobile-menu__map-detail-btn"
              disabled={SM.isEmpty(map)}
              onClick={e => acts.senseMap.toggleEditor(true)}
            >
              Map Detail
            </Dropdown.Item>
          }
          { inMap &&
            <Dropdown.Item
              id="sense-mobile-menu__map-share-btn"
              disabled={SM.isEmpty(map)}
              onClick={this._handleShare}
            >
              Share Map
            </Dropdown.Item>
          }
          <Dropdown.Item
            id="sense-mobile-menu__map-help-btn"
            as="a"
            href="https://help.sense.tw/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Help
          </Dropdown.Item>
          {
            this.props.authenticated
              ? this._renderLogoutItem()
              : this._renderLoginItem()
          }
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  _handleShare = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const { map } = this.props;
    const mapUrl = R.toMapPath({ mid: map.id });
    const fullUrl = location.protocol + '//' + location.hostname + ':' + location.port + mapUrl;
    copy(fullUrl);
  }

  _renderLoginItem() {
    const { actions: acts } = this.props;

    return (
      <Dropdown.Item
        id="sense-mobile-menu__map-login-btn"
        onClick={e => acts.account.loginRequest()}
      >
        Login
      </Dropdown.Item>
    );
  }

  _renderLogoutItem() {
    const { actions: acts } = this.props;

    return (
      <Dropdown.Item
        id="sense-mobile-menu__map-logout-btn"
        onClick={e => acts.account.logoutRequest()}
      >
        Logout
      </Dropdown.Item>
    );
  }
}

export default connect<StateFromProps, ActionProps>(
  (state: State) => {
    const { session, senseObject, senseMap } = state;
    return {
      authenticated: session.authenticated,
      map: CS.getMap(senseObject, senseMap.map),
    };
  },
  mapDispatch({ actions }),
)(withRouter(AccountMenuItem));
