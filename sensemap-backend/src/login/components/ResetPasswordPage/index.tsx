import * as React from 'react';
import { Form, Button } from 'semantic-ui-react';
import Layout from '../Layout';
import Message from '../Message';

type Props = {
  type: 'FORM' | 'RESULT';
  token?: string;
  messages?: {
    passwordError: string[];
  };
};

const ResetPasswordPage = (props: Props = { type: 'FORM', token: '' }) => {
  if (props.type === 'RESULT') {
    return (
      <Layout header='Reset Password' style={{ background: '#fcb3d7' }}>
        <div>Your password has been reset!  <a href="/login">LOG IN!</a></div>
      </Layout>
    );
  } else {
    const passwordError = props.messages
      ? props.messages.passwordError.map(m => <Message negative>{m}</Message>)
      : null;
    return (
      <Layout header='Reset Password' style={{ background: '#fcb3d7' }}>
        <Form size='large' method='post'>
          <input type='hidden' name='token' value={props.token} />
          <Form.Input
            name='password'
            type='password'
            placeholder='Password'
            fluid={true}
            icon='lock'
            iconPosition='left'
            error={false}
            />
          {passwordError}
          <Button fluid={true} color='black'>RESET</Button>
          <div>My memory is back!  <a href="/login">LOG IN!</a></div>
        </Form>
      </Layout>
    );
  }
};

export default ResetPasswordPage;
