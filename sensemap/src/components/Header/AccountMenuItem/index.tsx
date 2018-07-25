import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link, RouteComponentProps } from 'react-router-dom';
import { Menu, Icon, Dropdown } from 'semantic-ui-react';
import { State, actions } from '../../../types';
import * as R from '../../../types/routes';

interface StateFromProps {
    authenticated: boolean;
}

// tslint:disable:no-any
type Props = StateFromProps & RouteComponentProps<any>;

class AccountMenuItem extends React.Component<Props> {
    render() {
        return !this.props.authenticated 
            ? this._renderLoginLink() 
            : this._renderDropdownMenu();
    }
    _renderLoginLink() {
        return (
            <Menu.Item
                as={Link}
                to={R.login}
            >
            Login
            </Menu.Item>
        );
    }
    _renderDropdownMenu() {
        return (
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
                        <Dropdown.Item
                            as={Link}
                            to={R.settings}
                        >
                            Settings
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={e => actions.account.logoutRequest(this.props.history)}
                        >
                            Logout
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Menu.Item>
        );
    }
}

export default connect<StateFromProps>(
    (state: State) => ({
        authenticated: state.session.authenticated,
        user: state.session.user
    })
)(withRouter(AccountMenuItem));