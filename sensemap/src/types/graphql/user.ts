import { UserData, anonymousUserData, UserID } from '../sense/user';
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

export const loadByIds =
  (user: SN.User, ids: UserID[]) => {
    if (ids.length === 0) {
      return Promise.resolve([]);
    }
    const query = `
      query {
        ${ids.map((id, i) =>
          `user_${i}: User(id: "${id}"){
            ...userFields
          }`
        )}
      }
      ${graphQLUserFieldsFragment}
    `;
    return client(user).request(query)
      .then(data => Object.values(data))
      .then(data => data.map(toUserData));
  };
