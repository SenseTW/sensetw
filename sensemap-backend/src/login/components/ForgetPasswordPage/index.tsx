import * as React from 'react';
import { Form, Button } from 'semantic-ui-react';
import Layout from '../Layout';
import Message from '../Message';

type Props = {
  type: 'FORM' | 'RESULT';
  messages?: {
    emailError: string[];
  },
};

const ForgetPasswordPage = (props: Props = { type: 'FORM' }) => {
  if (props.type === 'RESULT') {
    return (
      <Layout header='Reset Password' style={{ background: '#fcb3d7' }}>
        <div>A link to reset your password is sent!  Check your email!</div>
      </Layout>
    );
  } else {
    const emailError = props.messages.emailError.map(m => <Message>{m}</Message>);
    return (
      <Layout header='Reset Password' style={{ background: '#fcb3d7' }}>
        <Form size='large' method='post'>
          <Form.Input
            name='email'
            type='text'
            placeholder='Hello@sense.tw'
            fluid={true}
            icon='mail'
            iconPosition='left'
            error={false}
            />
          {emailError}
          <Button fluid={true} color='black'>RESET</Button>
          <div>My memory is back!  <a href="/login">LOG IN!</a></div>
        </Form>
      </Layout>
    );
  }
};

export default ForgetPasswordPage;
