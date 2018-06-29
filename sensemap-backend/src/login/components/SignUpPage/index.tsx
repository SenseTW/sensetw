import * as React from 'react';
import { Grid, Segment, Header, Form, Button } from 'semantic-ui-react';

function SignUpPage(props) {
  return (
    <Grid textAlign="center" verticalAlign="middle" style={{ height: '100%', background: '#b3fcfb' }}>
      <Grid.Column style={{ maxWidth: 400 }}>
        <Segment>
          <Header>Create new account</Header>
          <Form size="large" method="post">
            <Form.Input name="username" fluid={true} icon="user circle" iconPosition="left" placeholder="Username" type="text" />
            <Form.Input name="email" fluid={true} icon="mail" iconPosition="left" placeholder="Email" type="text" />
            <Form.Input name="password" fluid={true} icon="lock" iconPosition="left" placeholder="Password" type="password" />
            <div>You are agreeing to our Terms of Service and Community Guidelines.</div>
            <Button fluid={true} color="black">SIGN UP</Button>
            <div>Already have an account?  <a href="/login">Log in</a></div>
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
}

export default SignUpPage;
