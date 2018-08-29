import * as React from 'react';
import Layout from '../Layout';
import { Form, Button, Message } from 'semantic-ui-react';

const LoginPage = (props) => {
  const errorMessages = props.messages.error.map(m => <Message negative>{m}</Message>);
  return (
    <Layout header='Welcome Back'>
      <Form size='large' method='post'>
        {errorMessages}
        <Form.Input
          name='email'
          type='text'
          placeholder='Hello@sense.tw'
          fluid={true}
          icon='mail'
          iconPosition='left'
          />
        <Form.Input
          name='password'
          type='password'
          placeholder='Password'
          fluid={true}
          icon='lock'
          iconPosition='left'
          />
        <div>
          <a href='/forget-password'>Forget Password?</a>
        </div>
        <Button fluid={true} color='black'>LOG IN</Button>
        <div>
          Don't have a Sense.tw account?  <a href="/signup">Sign up</a>
        </div>
      </Form>
    </Layout>
  );
}

export default LoginPage;
