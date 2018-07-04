import * as express from 'express';
import { Context } from '../context';

export function router(context: Context) {
  const router = express.Router()
  const { env } = context();

  router.get('/', (req, res) => {
    // XXX need to take off some of these
    const links = {
      "account.settings": `${env.HYPOTHESIS_API_ROOT}/account/settings`,
      //"forgot-password": "https://h.sense.tw/forgot-password",
      //"groups.new": "https://h.sense.tw/groups/new",
      //"help": "https://h.sense.tw/docs/help",
      "oauth.authorize": `${env.PUBLIC_URL}/oauth/authorize`,
      "oauth.revoke": `${env.PUBLIC_URL}/oauth/revoke`,
      //"search.tag": "https://h.sense.tw/search?q=tag:\":tag\"",
      "signup": `${env.PUBLIC_URL}/signup`,
      //"user": `${env.HYPOTHESIS_API_ROOT}/u/:user`,
    };

    res.send(links);
  });

  return router;
}
