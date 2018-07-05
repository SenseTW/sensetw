import * as React from 'react';
import { Link } from 'react-router-dom';
import { Container, Form, Header, Input, Button } from 'semantic-ui-react';
import * as R from '../../types/routes';
import './index.css';

class SettingsPage extends React.PureComponent {
  render() {
    return (
      <div className="settings-page">
        <Container>
          <Form>
            <Header>Change password</Header>
            <Form.Field>
              <label>Verify current password</label>
              <Input disabled />
              <span className="settings-page__hint">
                Forget password?&nbsp;
                <Link to={R.settings}>Here</Link>
              </span>
            </Form.Field>
            <Form.Field>
              <label>New password</label>
              <Input disabled />
              <span className="settings-page__hint">Password must be between 8 and 16 characters.</span>
            </Form.Field>
            <Form.Field>
              <label>Confirm new password</label>
              <Input disabled />
            </Form.Field>
            <Button
              fluid
              disabled
              color="black"
              className="settings-page__submit"
            >
              Update Password
            </Button>
          </Form>
        </Container>
      </div>
    );
  }
}

export default SettingsPage;