import { HasID } from './has-id';
import { equals } from 'ramda';

export type UserID = string;

export interface UserData extends HasID<UserID> {
  username: string;
  email:    string;
}

export const anonymousUserData: UserData = {
  id: '0',
  username: 'anonymous',
  email: '',
};

export const isEmpty = (user: UserData): boolean =>
  equals(anonymousUserData, user);