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
  passwordStatus: S.PasswordStatus;
}

type Props = StateFromProps & ActionProps;

class SettingsPage extends React.PureComponent<Props> {
  render() {
    const { actions: acts, oldPassword, newPassword, confirmPassword, passwordStatus } = this.props;
    const isNewPasswordInRange = isInRange(newPassword);
    const isNewPasswordMatched = equals(newPassword, confirmPassword);
    const isValid = isNewPasswordInRange && isNewPasswordMatched;

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
                error={passwordStatus === S.PasswordStatus.OLD_PASSWORD_WRONG}
                onChange={e => acts.settings.updateOldPassword(e.currentTarget.value)}
              />
              {
                passwordStatus === S.PasswordStatus.OLD_PASSWORD_WRONG &&
                <span className="settings-page__error">Wrong password.</span>
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
                error={
                  (newPassword.length !== 0 && !isNewPasswordInRange) ||
                    passwordStatus === S.PasswordStatus.NEW_PASSWORD_INVALID
                }
                onChange={e => acts.settings.updateNewPassword(e.currentTarget.value)}
              />
              {
                newPassword.length === 0 || isNewPasswordInRange
                  ? <span className="settings-page__hint">Password must be between 8 and 16 characters.</span>
                  : <span className="settings-page__error">Password must be between 8 and 16 characters.</span>
              }
              {
                passwordStatus === S.PasswordStatus.NEW_PASSWORD_INVALID &&
                <span className="settings-page__error">Password was invalid.</span>
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
            <div className="settings-page__submit">
              {
                passwordStatus === S.PasswordStatus.SUCCESS &&
                <span className="settings-page__message">Password successfully changed.</span>
              }
              <Button
                fluid
                disabled={!isValid}
                color="black"
                className="settings-page__submit"
                onClick={acts.settings.submitNewPassword}
              >
                Update Password
              </Button>
            </div>
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
    const passwordStatus = S.getPasswordStatus(settings);

    return {
      oldPassword,
      newPassword,
      confirmPassword,
      passwordStatus,
    };
  },
  mapDispatch({ actions })
)(SettingsPage);
