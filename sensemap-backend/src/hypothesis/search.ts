import * as express from 'express';
import { pick } from 'ramda';
import * as C from '../types/card';
import { translateAnnotation } from './card';

type SearchQuery = {
  limit?: number,
  offset?: number,
  sort?: 'updated',
  order?: 'desc' | 'asc',
  uri?: string,
  url?: string,
  user?: string,
  group?: string,
  tag?: string,
  any?: string,
};

function compileAllCardsArgs(query: SearchQuery): C.AllCardsArgs {
  const { limit, offset, sort, order, uri, url, user, group, tag } = query;

  let filter: C.CardFilter = {};
  if (uri || url) {
    filter.url = uri || url;
  }
  if (tag) {
    filter.tags = tag;
  }
  if (group) {
    filter.map = { id: group }
  }

  let args: C.AllCardsArgs = { filter };
  if (limit) {
    args.limit = limit;
  }
  if (offset) {
    args.skip = offset;
  }
  if (sort === 'updated') {
    args.orderBy = order ? ['updatedAt', order] : 'updatedAt';
  }
  return args;
}

export function router(context) {
  const router = express.Router();

  router.get('/', (req, res, next) => {
    const args = compileAllCardsArgs(req.query);
    const { db, env } = context({ req });
    C.getAllCards(db, args, C.cardsWithTargetQuery).then((cards) => {
      const rows = cards.map(translateAnnotation(env));
      const total = rows.length;
      res.send({ rows, total });
    });
  });

  return router;
}
