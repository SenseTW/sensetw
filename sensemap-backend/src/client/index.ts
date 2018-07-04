import * as express from 'express';

const client_url = process.env.CLIENT_URL || 'https://h.sense.tw/embed.js';
const public_url = process.env.PUBLIC_URL || 'https://api.sense.tw/';
const client_oauth_id = process.env.CLIENT_OAUTH_ID;

export function router(context) {
  const router = express.Router();
  router.get('/app.html', (req, res, next) => {
    res.render('app', {
      app_config: JSON.stringify({
        'apiUrl': `${public_url}h/api`,
        //'authDomain': request.authority,
        'oauthClientId': client_oauth_id,
        //'release': __version__,
        'serviceUrl': public_url,
        // The list of origins that the client will respond to cross-origin RPC
        // requests from.
        //'rpcAllowedOrigins': settings.get('h.client_rpc_allowed_origins'),
      }),
      embed_url: client_url,
    });
  });
  return router;
}
