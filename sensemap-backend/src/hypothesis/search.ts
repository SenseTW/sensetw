import * as express from 'express';
import { pick } from 'ramda';
import * as C from '../types/card';

function compileCardFilter(query) {
  const { uri, url, group, tag } = query;
  return {
    url: uri || url,
    map: group,
    tags: tag,
  };
}

function translateAnnotation(card) {
  return {
    id: card.id,
  };
}

export function router(context) {
  const router = express.Router();

  router.get('/', (req, res, next) => {
    const cardFilter = compileCardFilter(req.query);
    const { db } = context({ req });
    C.getAllCards(db, cardFilter).then((cards) => {
      const rows = cards.map(translateAnnotation);
      const total = rows.length;
      res.send({ rows, total });
    });
  });

  return router;
}
