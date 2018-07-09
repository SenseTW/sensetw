import * as React from 'react';
import { Grid, Segment, Header, Form, Button } from 'semantic-ui-react';

function LoginPage(props) {
  return (
    <Grid textAlign="center" verticalAlign="middle" style={{ height: '100%', background: '#b3e5fc' }}>
      <Grid.Column style={{ maxWidth: 400 }}>
        <Segment>
          <Header>Welcome Back</Header>
          <Form size="large" method="post">
            <Form.Input name="username" fluid={true} icon="mail" iconPosition="left" placeholder="Hello@sense.tw" type="text" />
            <Form.Input name="password" fluid={true} icon="lock" iconPosition="left" placeholder="Password" type="password" />
            <div>
              <a href="mailto:hello@sense.tw">Forget Password?</a>
            </div>
            <Button fluid={true} color="black">LOG IN</Button>
            <div>
              Don't have a Sense.tw account?  <a href="/signup">Sign up</a>
            </div>
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  )
}

export default LoginPage;
