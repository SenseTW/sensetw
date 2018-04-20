export type UserID = string;

export interface UserData {
  id: UserID;
}

export const emptyUser: UserData = {
  id: '0'
};