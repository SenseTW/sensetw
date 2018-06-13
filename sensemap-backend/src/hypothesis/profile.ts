import * as express from 'express';
import * as M from '../types/map';
import { MiddlewareConfig } from '.';

export function router(config: MiddlewareConfig) {
  const router = express.Router();

  router.get('/', (req, res) => {
    const { db } = config.context({ req });
    M.getAllMaps(db).then((maps) => {
      const groups = maps.map(map => ({
        id: map.id,
        name: '',
        public: true,
      }));

      const profile = {
        preferences: {},
        groups,
        userid: null,
        authority: 'ggv.tw',
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
