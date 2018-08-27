import * as React from 'react';
import { Grid, Segment, Header, Form, Button } from 'semantic-ui-react';

function SignUpPage(props) {
  const { usernameError, emailError, passwordError } = props.messages;
  return (
    <Grid textAlign="center" verticalAlign="middle" style={{ height: '100%', background: '#b3fcfb' }}>
      <Grid.Column style={{ maxWidth: 400 }}>
        <Segment>
          <Header>Create new account</Header>
          <Form size="large" method="post">
            <Form.Input name="username" error={usernameError.length > 0} fluid={true} icon="user circle" iconPosition="left" placeholder="Username" type="text" />
            <Form.Input name="email" error={emailError.length > 0} fluid={true} icon="mail" iconPosition="left" placeholder="Email" type="text" />
            <Form.Input name="password" error={passwordError.length > 0} fluid={true} icon="lock" iconPosition="left" placeholder="Password" type="password" />
            <div>You are agreeing to our <a href="http://sense.tw/terms-of-service">Terms of Service</a> and Community Guidelines.</div>
            <Button fluid={true} color="black">SIGN UP</Button>
            <div>Already have an account?  <a href="/login">Log in</a></div>
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
}

export default SignUpPage;
