import { client } from './client';
import * as SN from '../session';

export const updatePassword =
  (password: string, user: SN.User) => {
    const query = `
      mutation ChangePassword($password: String) {
        changePassword(password: $password) {
          id
        }
      }
    `;
    return client(user).request(query )
      .then(({ changePassword }) => ({ id: changePassword.id }));
  };
