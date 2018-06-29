import * as express from 'express';
import { Context } from '../context';

export function router(context: Context) {
  const router = express.Router()

  router.get('/', (req, res) => {
    // XXX need to take off some of these
    const links = {
      "account.settings": "https://h.sense.tw/account/settings",
      "forgot-password": "https://h.sense.tw/forgot-password",
      "groups.new": "https://h.sense.tw/groups/new",
      "help": "https://h.sense.tw/docs/help",
      "oauth.authorize": "https://h.sense.tw/oauth/authorize",
      "oauth.revoke": "https://h.sense.tw/oauth/revoke",
      "search.tag": "https://h.sense.tw/search?q=tag:\":tag\"",
      "signup": "https://h.sense.tw/signup",
      "user": "https://h.sense.tw/u/:user",
    };

    res.send(links);
  });

  return router;
}
