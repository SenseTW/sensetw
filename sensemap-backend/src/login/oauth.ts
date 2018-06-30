import OAuthServer = require('express-oauth-server');

const model = {
  getAccessToken: null,
  getClient: null,
  getAuthorizationCode: null,
  saveAuthorizationCode: null,
  saveToken: null,
  verifyScope: null,
};

const oauth = new OAuthServer({ model });

export default oauth;
