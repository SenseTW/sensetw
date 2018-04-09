import * as React from 'react';
import { Menu } from 'semantic-ui-react';
import { RouteComponentProps, withRouter, Link } from 'react-router-dom';

// tslint:disable-next-line:no-any
class Header extends React.PureComponent<RouteComponentProps<any>> {
  render() {
    const { location } = this.props;

    return (
      <Menu fixed="top">
        <Menu.Item
          as={Link}
          to="/"
          name="main"
          active={location.pathname === '/'}
        >
          sense.tw
        </Menu.Item>
        <Menu.Item
          as={Link}
          to="/counter"
          name="counter"
          active={location.pathname === '/counter'}
        >
          counter
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(Header);