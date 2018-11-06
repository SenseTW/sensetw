import * as React from 'react';
import { Form, Button } from 'semantic-ui-react';
import Layout from '../Layout';
import Message from '../Message';

function SignUpPage(props) {
  const errorMessages = props.messages.error.map(m => <Message negative>{m}</Message>);
  const usernameError = props.messages.usernameError.map(m => <Message>{m}</Message>);
  const emailError = props.messages.emailError.map(m => <Message>{m}</Message>);
  const passwordError = props.messages.passwordError.map(m => <Message>{m}</Message>);

  return (
    <Layout header='Create new account' style={{ background: '#b3fcfb' }}>
      <Form size='large' method='post'>
        {errorMessages}
        <Form.Input
          name='username'
          type='text'
          placeholder='Username'
          fluid={true}
          icon='user circle'
          iconPosition='left'
          error={errorMessages.length > 0 || usernameError.length > 0}
          />
        {usernameError}
        <Form.Input
          type='text'
          name='email'
          placeholder='Email'
          fluid={true}
          icon='mail'
          iconPosition='left'
          error={errorMessages.length > 0 || emailError.length > 0}
          />
        {emailError}
        <Form.Input
          name='password'
          type='password'
          placeholder='Password'
          fluid={true}
          icon='lock'
          iconPosition='left'
          error={errorMessages.length > 0 || passwordError.length > 0}
          />
        {passwordError}
        <div>You are agreeing to our <a href="http://sense.tw/terms-of-service">Terms of Service</a> and Community Guidelines.</div>
        <Button id="sense-signup__signup-btn" fluid={true} color='black'>SIGN UP</Button>
        <div>Already have an account?  <a href="/login">Log in</a></div>
      </Form>
    </Layout>
  );
}

export default SignUpPage;
