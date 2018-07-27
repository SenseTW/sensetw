import { UserData } from '../sense/user';

export const graphQLUserFieldsFragment = `
  fragment userFields on User {
    id, email, username
  }`;

export interface GraphQLUserFields {
  id:       string;
  email:    string;
  username: string;
}

export const toUserData: (u: GraphQLUserFields) => UserData =
  u => u;
