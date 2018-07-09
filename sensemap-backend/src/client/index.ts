import * as express from 'express';
import { Context } from '../context';

export function router(context: Context) {
  const { env } = context();
  const router = express.Router();
  router.get('/app.html', (req, res, next) => {
    res.render('app', {
      app_config: JSON.stringify({
        'apiUrl': `${env.PUBLIC_URL}/h/api`,
        //'authDomain': request.authority,
        'oauthClientId': env.CLIENT_OAUTH_ID,
        //'release': __version__,
        'serviceUrl': env.PUBLIC_URL,
        // The list of origins that the client will respond to cross-origin RPC
        // requests from.
        //'rpcAllowedOrigins': settings.get('h.client_rpc_allowed_origins'),
      }),
      embed_url: env.CLIENT_JS_URL,
    });
  });
  return router;
}
