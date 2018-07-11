import * as express from 'express';
import { Context } from '../context';
import * as T from '../types/sql';
import * as A from '../types/annotation';

type AnnotationQuery = {
};

function fromAnnotation(env, annotation: T.Annotation): any {
  return {
    id: annotation.id,
    created: annotation.createdAt,
    group: annotation.mapId,
    updated: annotation.updatedAt,
    target: annotation.target,
    links: {
      json: `${env.HYPOTHESIS_API_ROOT}/annotations/${annotation.id}`,
      // XXX
      incontext: `https://O.sense.tw/${annotation.id}`,
    },
    tags: annotation.card.tags.split(','),
    text: annotation.card.title,
    uri: annotation.card.url,
    flagged: false,
    user_info: {
      display_name: null,
    },
    user: '',
    document: annotation.document,
  };
}

function getSummary(o: any): string {
  if (o.text) {
    return o.text;
  }
  const quotes = o.target.map(t => t.selector.find(s => s.type === 'TextQuoteSelector')).filter(s => !!s);
  if (quotes.length > 0) {
    return quotes[0].exact;
  }
  return '';
}

function toAnnotation(env, o: any) {
  // use TexQuoteSelector
  const summary = getSummary(o);
  return {
    mapId: o.group === '__world__' ? process.env.PUBLIC_MAP_ID : o.group,
    target: o.target,
    document: o.document,
    card: {
      url: o.uri,
      tags: o.tags ? o.tags.join(',') : '',
      summary,
    },
  };
}

export function router(context: Context) {
  const router = express.Router()

  router.get('/:id', async (req, res) => {
    const { db, env } = context({ req });
    const a = await A.getAnnotation(db, req.params.id);
    res.send(fromAnnotation(env, a));
  });

  router.post('/', async (req, res) => {
    const { db, env } = context({ req });
    const args = toAnnotation(env, req.body);
    const a = await A.createAnnotation(db, args);
    res.send(fromAnnotation(env, a));
  });

  router.patch('/:id', async (req, res) => {
    const { db, env } = context({ req });
    const args = toAnnotation(env, req.body);
    const a = await A.updateAnnotation(db, req.params.id, args);
    res.send(fromAnnotation(env, a));
  });

  router.delete('/:id', async (req, res) => {
    const { db, env } = context({ req });
    //const a = await A.deleteAnnotation(db, req.params.id);
    const a = {
      id: req.params.id,
      deleted: false,
    }
    res.send(a);
  });

  return router;
}
