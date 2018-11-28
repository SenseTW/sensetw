import * as React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import * as R from '../../../types/routes';
const logo = require('../logo.png');

export const height = 43;

class MobileHeader extends React.PureComponent {
  render() {
    return (
      <div className="sense-header mobile">
        <Menu inverted>
          <Menu.Item
            id="sense-header__home-btn"
            as={Link}
            to={R.index}
          >
            <img src={logo} />
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default MobileHeader;