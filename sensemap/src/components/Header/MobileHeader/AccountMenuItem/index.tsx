import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import { State, ActionProps, mapDispatch, actions } from '../../../../types';
import * as SM from '../../../../types/sense/map';
import * as CS from '../../../../types/cached-storage';

interface StateFromProps {
  authenticated: boolean;
  map: SM.MapData;
}

// tslint:disable:no-any
type Props = StateFromProps & ActionProps & RouteComponentProps<any>;

class AccountMenuItem extends React.PureComponent<Props> {
  render() {
    return (
      <Dropdown
        item
        icon="ellipsis horizontal"
      >
        <Dropdown.Menu>
        {
          this.props.authenticated
            ? this._renderMenu()
            : this._renderLoginMenu()
        }
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  _renderLoginMenu() {
    const { actions: acts } = this.props;

    return (
      <Dropdown.Item onClick={e => acts.account.loginRequest()}>
        Login
      </Dropdown.Item>
    );
  }

  _renderMenu() {
    const { actions: acts, map } = this.props;

    return (
      <>
        <Dropdown.Item
          id="sense-mobile-menu__map-detail-btn"
          disabled={SM.isEmpty(map)}
          onClick={e => acts.senseMap.toggleEditor(true)}
        >
          Map Detail
        </Dropdown.Item>
        <Dropdown.Item disabled>
          Share Map
        </Dropdown.Item>
        <Dropdown.Item
          as="a"
          href="https://help.sense.tw/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Help
        </Dropdown.Item>
        <Dropdown.Item onClick={e => acts.account.logoutRequest()}>
          Logout
        </Dropdown.Item>
      </>
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
