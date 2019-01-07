import * as nock from 'nock';
import { nockedAPI } from './client.test';
import {
  GraphQLUserFields,
  updatePassword,
  verifyPassword,
} from './user';
import { UserData } from '../sense/user';
import { User } from '../session';

const rawUser: GraphQLUserFields = {
  id: 'aa60e84f-d893-48b5-82bd-cd0a4632a48e',
  email: 'v@example.com',
  username: 'Ahab',
};

const userData: UserData = {
  id: 'aa60e84f-d893-48b5-82bd-cd0a4632a48e',
  email: 'v@example.com',
  username: 'Ahab',
};

const user: User = {
  ...userData,
  access_token: 'fdb46644e3fbd31bed9e07b8fba8517d231c5cf3',
  refresh_token: '7fe71a3d83f6194299219f0f96f3ff9319cb6fbd',
};

describe('GraphQL API', () => {
  beforeAll(() => nock.disableNetConnect());
  afterAll(() => nock.enableNetConnect());

  afterEach(() => nock.cleanAll());

  describe('User', () => {
    describe('updatePassword', async () => {
      nockedAPI.reply(200, { data: { changePassword: rawUser } });
      const result = await updatePassword(user, 'foobar');
      expect(result).toEqual(userData);
    });

    describe('verifyPassword', async () => {
      nockedAPI.reply(200, { data: { verifyPassword: rawUser } });
      const result = await verifyPassword(user, 'foobar');
      expect(result).toEqual(userData);
    });
  });
});