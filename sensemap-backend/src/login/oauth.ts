import { Client, User, Token, AuthorizationCode } from 'oauth2-server';
import OAuthServer = require('express-oauth-server');
import { context } from '../context';
import * as U from '../types/user';

const { db, env } = context();

export const hypothesisClient = {
  id: env.CLIENT_OAUTH_ID,
  grants: ['authorization_code'],
  name: 'Hypothesis API',
  redirectUris: [`${env.PUBLIC_URL}/oauth/web_message`],
};

const getClient = async (id: string, secret?: string): Promise<Client> => {
  if (id === hypothesisClient.id) {
    return hypothesisClient;
  } else {
    return null;
  }
};

const getUser = async (id: string): Promise<User> => {
  return U.getUser(db, id);
};

export const getAccessToken = async (accessToken: string): Promise<Token> => {
  const rows = await db.select(['accessToken', 'accessTokenExpiresAt', 'refreshToken', 'refreshTokenExpiresAt', 'clientId', 'userId']).from('oauth_token').where('accessToken', accessToken);
  if (rows.length === 0) {
    return null;
  }
  return {
    ...rows[0],
    client: await getClient(rows[0].clientId),
    user: await getUser(rows[0].userId),
  };
};

const saveToken = async (token: Token, client: Client, user: User): Promise<Token> => {
  const rows = await db('oauth_token').insert({
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    clientId: client.id,
    userId: user.id,
  });
  const t = {
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    client: await getClient(client.id),
    user: await getUser(user.id),
  };
  return t;
};

const getAuthorizationCode = async (authorizationCode: string): Promise<AuthorizationCode> => {
  const rows = await db.select('*').from('oauth_authorization_code').where('authorizationCode', authorizationCode);
  if (rows.length === 0) {
    return null;
  }
  const code = {
    ...rows[0],
    client: await getClient(rows[0].clientId),
    user: await getUser(rows[0].userId),
  };
  return code;
};

const saveAuthorizationCode = async (code: AuthorizationCode, client: Client, user: User): Promise<AuthorizationCode> => {
  const values = {
    authorizationCode: code.authorizationCode,
    expiresAt: code.expiresAt,
    redirectUri: code.redirectUri,
    client,
    user,
  };
  const rows = await db('oauth_authorization_code').insert({
    authorizationCode: code.authorizationCode,
    expiresAt: code.expiresAt,
    redirectUri: code.redirectUri,
    clientId: client.id,
    userId: user.id,
  });
  return values;
};

const revokeAuthorizationCode = async (code: AuthorizationCode): Promise<boolean> => {
  await db('oauth_authorization_code').where('authorizationCode', code.authorizationCode).del();
  return true;
}

export const revokeUserToken = async (user: User): Promise<boolean> => {
  await db('oauth_token').where('userId', user.id).del();
  return true;
}

const verifyScope = async (token: Token, scope: string): Promise<boolean> => {
  return true;
}

const model = {
  getClient,

  getAccessToken,
  saveToken,

  getAuthorizationCode,
  saveAuthorizationCode,
  revokeAuthorizationCode,

  verifyScope,
};

const oauth = new OAuthServer({ model, requireClientAuthentication: { authorization_code: false } });

export default oauth;
