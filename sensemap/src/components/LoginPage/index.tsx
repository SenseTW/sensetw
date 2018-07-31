import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Grid, Segment, Header, Form, Button } from 'semantic-ui-react';
import { State, actions, ActionProps, mapDispatch } from '../../types';
import { RouteComponentProps } from 'react-router-dom';
import * as R from '../../types/routes';
import { matches, isLength } from 'validator';
import './index.css';

type StateFromProps = {
  username: string,
  password: string,
};

// tslint:disable:no-any
type Props = StateFromProps & ActionProps & RouteComponentProps<any>;

class LoginPage extends React.PureComponent<Props> {
  render () {
    const { actions: acts, username, password, history} = this.props;
    const isValidUsername = matches(username, /^[A-Za-z0-9]+(?:\.[A-Za-z0-9]+)*$/);
    const isUsernameInRange = isLength(username, {min: 2});
    const isPasswordInRange = isLength(password, {min: 8});
    const isValid = !!username && !!password && isValidUsername && isUsernameInRange && isPasswordInRange;

    return (
        <Grid className="login-page" textAlign="center" verticalAlign="middle" >
          <Grid.Column style={{ maxWidth: 400 }}>
            <Segment>
              <Header>Welcome Back</Header>
              <Form size="large">
                <Form.Input 
                  name="username" 
                  fluid={true} 
                  icon="user circle" 
                  iconPosition="left" 
                  placeholder="Username" 
                  type="text" 
                  value={username}
                  error={username.length !== 0 && (!isUsernameInRange || !isValidUsername)}
                  onChange={(e) => acts.account.updateUsername(e.currentTarget.value)}
                />
               {
                  username.length === 0 || !isUsernameInRange  &&
                  <span className="login-page__error">Username must more than 2 characters.</span>
                }
               {
                  username.length === 0 || !isValidUsername &&
                  <span className="login-page__error">Please use only letters, numbers and periods.</span>
                }
                <Form.Input 
                  name="password" 
                  fluid={true} 
                  icon="lock" 
                  iconPosition="left" 
                  placeholder="Password" 
                  type="password" 
                  value={password}
                  error={password.length !== 0 && !isPasswordInRange}
                  onChange={(e) => acts.account.updatePassword(e.currentTarget.value)}
                />
                {
                  password.length === 0 || !isPasswordInRange &&
                  <span className="login-page__error">Password must be more thatn 8 characters.</span>
                }
                <div>
                  <a href="mailto:hello@sense.tw">Forget Password?</a>
                </div>
                <Button 
                  fluid={true} 
                  color="black" 
                  disabled={!isValid} 
                  onClick={async () => {
                     await acts.account.loginRequest(username, password, history);
                  }}
                >
                  LOG IN
                </Button>
                <div>
                  Don't have a Sense.tw account? <Link to={R.signup} >Sign up</Link>
                </div>
              </Form>
            </Segment>
          </Grid.Column>
        </Grid>
    );
  }
}

export default connect<StateFromProps, ActionProps>(
  (state: State) => {
    const { account } = state;
    return {
      username: account.username,
      password: account.password
    };
  },
  mapDispatch({ actions })
)(withRouter(LoginPage));