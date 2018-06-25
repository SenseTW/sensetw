import * as React from 'react';
import { Menu, Icon, Dropdown } from 'semantic-ui-react';
import Breadcrumb from './Breadcrumb';
import Submenu from './Submenu';
import './index.css';
const logo = require('./logo.png');

interface Props {}

/**
 * The header contains a main menu with a submenu.
 *
 * It extends the normal React component instead of the pure component so the
 * breadcrumb component will rerender properly after updates.
 */
class Header extends React.Component<Props> {
  render() {
    return (
      <div className="sense-header">
        <Menu inverted>
          <Menu.Item>
            <img src={logo} />
          </Menu.Item>
          <Menu.Item>ABOUT</Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>
              <Icon name="question circle outline" size="large" />
            </Menu.Item>
            <Menu.Item>
              <Dropdown
                item
                icon={
                  <div>
                    <Icon name="user circle" size="large" />
                    &nbsp;
                    <Icon name="triangle down" />
                  </div>
                }
              >
                <Dropdown.Menu>
                  <Dropdown.Item>Profile</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <div className="sense-header__submenu">
          <Breadcrumb />
          <Submenu />
        </div>
      </div>
    );
  }
}

export default Header;