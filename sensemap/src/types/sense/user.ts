import { HasID } from './has-id';

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
