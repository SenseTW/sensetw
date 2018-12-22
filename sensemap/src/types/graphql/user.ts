import { UserData, anonymousUserData } from '../sense/user';
import { client } from './client';
import * as SN from '../session';

export const graphQLUserFieldsFragment = `
  fragment userFields on User {
    id, email, username
  }`;

export interface GraphQLUserFields {
  id:       string;
  email:    string;
  username: string;
}

export const toUserData: (u?: GraphQLUserFields | null) => UserData =
  u => u || anonymousUserData;

export const updatePassword =
  (user: SN.User, password: string) => {
    const query = `
      mutation ChangePassword($password: String) {
        changePassword(password: $password) {
          ...userFields
        }
      }
      ${graphQLUserFieldsFragment}
    `;
    return client(user).request(query, { password })
      .then(({ changePassword }) => toUserData(changePassword));
  };

export const verifyPassword =
  (user: SN.User, password: string) => {
    const query = `
      query VerifyPassword($password: String) {
        verifyPassword(password: $password) {
          ...userFields
        }
      }
      ${graphQLUserFieldsFragment}
    `;
    return client(user).request(query, { password })
      .then(({ verifyPassword: d }) => toUserData(d));
  };
