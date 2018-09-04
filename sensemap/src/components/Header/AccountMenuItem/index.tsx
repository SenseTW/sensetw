import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link, RouteComponentProps } from 'react-router-dom';
import { Menu, Icon, Dropdown } from 'semantic-ui-react';
import { User, State, ActionProps, mapDispatch, actions } from '../../../types';
import * as R from '../../../types/routes';

interface StateFromProps {
    authenticated: boolean;
    user: User;
}

// tslint:disable:no-any
type Props = StateFromProps & ActionProps & RouteComponentProps<any>;

class AccountMenuItem extends React.Component<Props> {
    render() {
        return !this.props.authenticated
            ? this._renderLoginLink()
            : this._renderDropdownMenu();
    }

    _renderLoginLink() {
        const { actions: acts } = this.props;
        return (
            <Menu.Item
                onClick={async (e) => await acts.account.loginRequest()}
            >
                Login
            </Menu.Item>
        );
    }

    _renderDropdownMenu() {
        const { actions: acts, user } = this.props;
        return (
            <Dropdown
                item
                icon={
                <div>
                    <Icon name="user circle" size="large" title={user.username} />
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
                        onClick={e => acts.account.logoutRequest()}
                    >
                        Logout
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

export default connect<StateFromProps, ActionProps>(
    (state: State) => ({
        authenticated: state.session.authenticated,
        user: state.session.user
    }),
    mapDispatch({ actions }),
)(withRouter(AccountMenuItem));
