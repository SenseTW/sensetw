import * as qs from 'querystring';
import * as express from "express";
import * as C from "../types/card";
import { translateAnnotation } from "./card";
import * as Debug from 'debug';
const debug = Debug('sensemap-backend:hypothesis-search')

type SearchQuery = {
  limit?: number;
  offset?: number;
  sort?: "updated";
  order?: "desc" | "asc";
  uri?: string;
  url?: string;
  user?: string;
  group?: string;
  tag?: string;
  any?: string;
};

function getURL(url: string | string[]): string {
  if (typeof url === "string") {
    return url;
  } else if (Array.isArray(url)) {
    const us = url.filter(u => u.substr(0, 4) === 'http');
    if (us.length > 0) {
      return us[0];
    }
  }
  return "";
}

function escapeURL(url: string): string {
  const i = url.lastIndexOf('/');
  return url.substr(0, i + 1) + qs.escape(url.substr(i + 1));
}

function compileAllCardsArgs(query: SearchQuery): C.AllCardsArgs {
  debug(query);
  const { limit, offset, sort, order, uri, url, group, tag } = query;

  let filter: C.CardFilter = {};
  if (uri || url) {
    filter.url = escapeURL(getURL(url) || getURL(uri));
  }
  if (tag) {
    filter.tags = tag;
  }
  if (group) {
    filter.map = { id: group };
  }

  let args: C.AllCardsArgs = { filter };
  if (limit) {
    args.limit = limit;
  }
  if (offset) {
    args.skip = offset;
  }
  if (sort === "updated") {
    args.orderBy = order ? ["updatedAt", order] : "updatedAt";
  }
  debug(args);
  return args;
}

export function router(context) {
  const router = express.Router();

  router.get("/", async (req, res, next) => {
    const args = compileAllCardsArgs(req.query);
    const { db, env } = context({ req });
    return C.getAllCards(db, args, C.cardsWithTargetQuery).then(cards => {
      const rows = cards.map(translateAnnotation(env));
      const total = rows.length;
      res.send({ rows, total });
    });
  });

  return router;
}
