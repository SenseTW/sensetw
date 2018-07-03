import * as express from 'express';
import { Context } from '../context';

const public_url = process.env.PUBLIC_URL || 'https://api.sense.tw/';
const api_root = process.env.HYPOTHESIS_API_ROOT || 'https://api.sense.tw/h/api';

export function router(context: Context) {
  const router = express.Router()

  router.get('/', (req, res) => {
    // XXX need to take off some of these
    const links = {
      "account.settings": `${api_root}/account/settings`,
      //"forgot-password": "https://h.sense.tw/forgot-password",
      //"groups.new": "https://h.sense.tw/groups/new",
      //"help": "https://h.sense.tw/docs/help",
      "oauth.authorize": `${public_url}/oauth/authorize`,
      "oauth.revoke": `${public_url}/oauth/revoke`,
      //"search.tag": "https://h.sense.tw/search?q=tag:\":tag\"",
      "signup": `${public_url}/signup`,
      //"user": `${api_root}/u/:user`,
    };

    res.send(links);
  });

  return router;
}
