import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Form, Header, Input, Button } from 'semantic-ui-react';
import { State, actions, ActionProps, mapDispatch } from '../../types';
import * as S from '../../types/settings';
import * as R from '../../types/routes';
import { equals } from 'validator';
import './index.css';

const isInRange = (str: string) => str.length >= 8 && str.length <= 16;

interface StateFromProps {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

type Props = StateFromProps & ActionProps;

class SettingsPage extends React.PureComponent<Props> {
  render() {
    const { actions: acts, oldPassword, newPassword, confirmPassword } = this.props;
    const isOldPasswordInRange = isInRange(oldPassword);
    const isNewPasswordInRange = isInRange(newPassword);
    const isNewPasswordMatched = equals(newPassword, confirmPassword);
    const isValid = isOldPasswordInRange && isNewPasswordInRange && isNewPasswordMatched;

    return (
      <div className="settings-page">
        <Container>
          <Form>
            <Header>Change password</Header>
            <Form.Field>
              <label>Verify current password</label>
              <Input
                type="password"
                value={oldPassword}
                error={oldPassword.length !== 0 && !isOldPasswordInRange}
                onChange={e => acts.settings.updateOldPassword(e.currentTarget.value)}
              />
              {
                oldPassword.length !== 0 && !isOldPasswordInRange &&
                <span className="settings-page__error">Password must be between 8 and 16 characters.</span>
              }
              <span className="settings-page__hint">
                Forget password?&nbsp;
                <Link to={R.settings}>Here</Link>
              </span>
            </Form.Field>
            <Form.Field>
              <label>New password</label>
              <Input
                type="password"
                value={newPassword}
                error={newPassword.length !== 0 && !isNewPasswordInRange}
                onChange={e => acts.settings.updateNewPassword(e.currentTarget.value)}
              />
              {
                newPassword.length === 0 || isNewPasswordInRange
                  ? <span className="settings-page__hint">Password must be between 8 and 16 characters.</span>
                  : <span className="settings-page__error">Password must be between 8 and 16 characters.</span>
              }
            </Form.Field>
            <Form.Field>
              <label>Confirm new password</label>
              <Input
                type="password"
                value={confirmPassword}
                error={!isNewPasswordMatched}
                onChange={e => acts.settings.updateConfirmPassword(e.currentTarget.value)}
              />
              {
                !isNewPasswordMatched &&
                <span className="settings-page__error">These values are not the same.</span>
              }
            </Form.Field>
            <Button
              fluid
              disabled={!isValid}
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

export default connect<StateFromProps, ActionProps>(
  (state: State) => {
    const { settings } = state;
    const oldPassword = S.getOldPassword(settings);
    const newPassword = S.getNewPassword(settings);
    const confirmPassword = S.getConfirmPassword(settings);

    return {
      oldPassword,
      newPassword,
      confirmPassword,
    };
  },
  mapDispatch({ actions })
)(SettingsPage);