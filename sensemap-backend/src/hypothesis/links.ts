import * as express from 'express';
import { Context } from '../context';

export function router(context: Context) {
  const router = express.Router()
  const { env } = context();

  router.get('/', (req, res) => {
    const links = {
      "account.settings": `${env.HYPOTHESIS_API_ROOT}/account/settings`,
      "forgot-password": `${env.HYPOTHESIS_API_ROOT}/forgot-password`,
      "groups.new": `${env.HYPOTHESIS_API_ROOT}/groups/new`,
      "help": `${env.HYPOTHESIS_API_ROOT}/docs/help`,
      "oauth.authorize": `${env.PUBLIC_URL}/oauth/authorize`,
      "oauth.revoke": `${env.PUBLIC_URL}/oauth/revoke`,
      "search.tag": `${env.HYPOTHESIS_API_ROOT}/search?q=tag:\":tag\"`,
      "signup": `${env.PUBLIC_URL}/signup`,
      "user": `${env.HYPOTHESIS_API_ROOT}/u/:user`,
    };

    res.send(links);
  });

  return router;
}
