import * as React from 'react';
import { Menu } from 'semantic-ui-react';
import { RouteComponentProps, withRouter, Link } from 'react-router-dom';
import * as R from '../../types/routes';

// tslint:disable-next-line:no-any
class Header extends React.PureComponent<RouteComponentProps<any>> {
  render() {
    const { location } = this.props;

    return (
      <Menu fixed="top">
        <Menu.Item
          as={Link}
          to={R.index}
          name="index"
          active={location.pathname === R.index}
        >
          sense.tw
        </Menu.Item>
        <Menu.Item
          as={Link}
          to={R.map}
          name="map"
          active={location.pathname === R.map}
        >
          map
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(Header);
