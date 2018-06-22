import * as React from 'react';
import { Menu, Icon, Dropdown } from 'semantic-ui-react';
import './index.css';
const logo = require('./logo.png');

interface Props {}

class Header extends React.PureComponent<Props> {
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
        <Menu>
          <Menu.Item>DASHBOARD</Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default Header;