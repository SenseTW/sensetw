import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Grid, Segment, Header, Form, Button } from 'semantic-ui-react';
import { RouteComponentProps } from 'react-router-dom';
import { State, actions, ActionProps, mapDispatch } from '../../types';
import * as R from '../../types/routes';
import { matches, isLength, isEmail } from 'validator';
import './index.css';

type StateFromProps = {
  username: string,
  email: string,
  password: string,
};

// tslint:disable:no-any
type Props = StateFromProps & ActionProps & RouteComponentProps<any>;

class SignUpPage extends React.PureComponent<Props> {
  render() {
    const { actions: acts, username, email, password, history } = this.props;
    const isValidUsername = matches(username, /^[A-Za-z0-9]+(?:\.[A-Za-z0-9]+)*$/);
    const isUsernameInRange = isLength(username, {min: 2});
    const isPasswordInRange = isLength(password, {min: 8});
    const isValid = !!username && !!password && isUsernameInRange && isValidUsername && isPasswordInRange;
    return (
        <Grid className="signup-page" textAlign="center" verticalAlign="middle" >
          <Grid.Column style={{ maxWidth: 400 }}>
            <Segment>
              <Header>Create new account</Header>
              <Form size="large" method="post">
                <Form.Input 
                  name="username" 
                  fluid={true} 
                  icon="user circle" 
                  iconPosition="left" 
                  placeholder="Username" 
                  type="text" 
                  value={username}
                  error={username.length !== 0 && (!isUsernameInRange || ! isValidUsername)}
                  onChange={e => acts.account.updateUsername(e.currentTarget.value)}
                />
                {
                  username.length === 0 || !isUsernameInRange && 
                  <span className="signup-page__error">Username must be more than 2 characters.</span>
                }
               {
                  username.length === 0 || !isValidUsername &&
                  <span className="signup-page__error">Please use only letters, numbers and periods.</span>
                }
                <Form.Input 
                  name="email" 
                  fluid={true} 
                  icon="mail" 
                  iconPosition="left" 
                  placeholder="Email" 
                  type="text" 
                  value={email}
                  error={email.length !== 0 && !isEmail(email)}
                  onChange={e => acts.account.updateEmail(e.currentTarget.value)}
                />
                <Form.Input 
                  name="password" 
                  fluid={true} 
                  icon="lock" 
                  iconPosition="left" 
                  placeholder="Password" 
                  type="password" 
                  vlaue={password}
                  error={password.length !== 0 && !isPasswordInRange}
                  onChange={e => acts.account.updatePassword(e.currentTarget.value)}
                />
                {
                  password.length === 0 || !isPasswordInRange &&
                  <span className="signup-page__error">Password must be more than 8 characters.</span>
                }
                <span className="signup-page__info" >
                  You are agreeing to our Terms of Service and Community Guidelines.
                </span>
                <Button 
                  fluid={true} 
                  color="black" 
                  disabled={!isValid} 
                  onClick={async e => {
                    await acts.account.signupRequest(username, email, password, history);
                  }} 
                >
                SIGN UP
                </Button>
                <div>Already have an account?  <Link to={R.login}>Log in</Link></div>
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
      email: account.email,
      password: account.password
    };
  },
  mapDispatch( {actions})
)(withRouter(SignUpPage));