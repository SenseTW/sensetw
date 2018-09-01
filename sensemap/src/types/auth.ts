import axios from 'axios';
import * as qs from 'qs';
import { pick } from 'ramda';
import { sanitizeURL } from './utils';

const apiRoot = sanitizeURL(process.env.REACT_APP_SENSEMAP_API_ROOT) || 'https://api.sense.tw';

export type Token = {
  access_token: string,
  refresh_token: string,
};

export type Profile = {
  id: string,
  email: string,
  username: string,
};

export type AuthorizationCode = {
  type: 'authorization_response',
  code: string,
  state: string,
};

/**
 * The profile remote request.
 *
 * @param {string} token The access token.
 * @returns {Promise<Profile>} A profile promise.
 */
export const profileRequest = (token: string): Promise<Profile> => {
  return axios
    .get(`${apiRoot}/h/api/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(({ data }) => pick<Profile, string>(['id', 'email', 'username'], data.sense_user));
};

/**
 * The token request.
 *
 * @param {AuthorizationCode} authCode The authorization code struct.
 * @returns {Promise<Token>} A promise with the access token and the refresh token.
 */
export const tokenRequest = (authCode: AuthorizationCode): Promise<Token> => {
  const { code } = authCode;
  return axios
    .post(
      `${apiRoot}/h/token`,
      qs.stringify({
        client_id: '00e468bc-c948-11e7-9ada-33c411fb1c8a',
        grant_type: 'authorization_code',
        code,
        client_secret: 'thereisnospoon',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )
    .then(({ data }) => pick<Token, string>(['access_token', 'refresh_token'], data));
};
