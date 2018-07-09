import * as express from 'express';
import * as M from '../types/map';
import { Context } from '../context';

export function router(context: Context) {
  const router = express.Router();

  router.get('/', (req, res) => {
    const userid = !!req.user ? `acct:${req.user.username}@ggv.tw` : null;
    const authority = 'ggv.tw';
    const { db } = context({ req });
    M.getAllMaps(db).then((maps) => {
      const groups = maps.map(map => ({
        id: map.id,
        name: map.name,
        public: true,
      }));

      const profile = {
        preferences: {},
        groups,
        userid,
        authority,
        features: {
          filter_highlights: true,
          api_render_user_info: true,
          overlay_highlighter: true,
          embed_cachebuster: false,
          client_display_names: false,
        },
      };

      res.send(profile);
    });
  });

  return router;
}
