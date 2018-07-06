import * as express from 'express';
import { Context } from '../context';
import * as T from '../types/sql';
import * as A from '../types/annotation';

function fromAnnotation(env, annotation: T.Annotation): any {
  return {
    id: annotation.id,
    created: annotation.createdAt,
    group: "",
    updated: annotation.updatedAt,
    target: annotation.target,
    links: {
      json: `${env.HYPOTHESIS_API_ROOT}/annotations/${annotation.id}`,
      // XXX
      incontext: `https://O.sense.tw/${annotation.id}`,
    },
    tags: [],
    text: "",
    uri: "",
    flagged: false,
    user_info: {
      display_name: null,
    },
    user: "",
    document: {
      title: []
    },
  };
}

function toAnnotation(o: any): T.Annotation {
  return o;
}

export function router(context: Context) {
  const router = express.Router()

  router.get('/:id', async (req, res) => {
    const { db, env } = context({ req });
    const a = await A.getAnnotation(db, req.params.id);
    res.send(fromAnnotation(env, a));
  });

  return router;
}
