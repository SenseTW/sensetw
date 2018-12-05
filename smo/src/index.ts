import * as dotenv from "dotenv";
dotenv.load();
import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import * as request from "request-promise-native";
import * as Debug from "debug";
import * as moment from "moment";
import { sort } from "ramda";

const debug = Debug("smo");
const port = process.env.PORT || "8001";
const graphql_root =
  process.env.SENSEMAP_GRAPHQL_ROOT || "https://api.sense.tw/graphql";

enum RequestType {
  INDEX = 'INDEX',
  MAP = 'MAP',
  SITEMAP = 'SITEMAP',
}

type IndexRequest = {
  type: RequestType.INDEX;
};

type MapRequest = {
  type: RequestType.MAP;
  mapId: string;
  boxId?: string;
};

type SitemapRequest = {
  type: RequestType.SITEMAP;
}

type MapRequestParam = IndexRequest | MapRequest | SitemapRequest;

function parseRequest(req: http.IncomingMessage): MapRequestParam {
  const parts = req.url.split("/");
  switch (parts.length) {
    case 3: {
      return { type: RequestType.MAP, mapId: parts[2] };
    }
    case 5: {
      return { type: RequestType.MAP, mapId: parts[2], boxId: parts[4] };
    }
    case 2: {
      if (parts[1] === 'sitemap.xml') {
        return { type: RequestType.SITEMAP };
      }
      return { type: RequestType.INDEX };
    }
    default: {
      return { type: RequestType.INDEX };
    }
  }
}

type GraphQLRequest = {
  operationName: string;
  query: string;
  variables?: { [key: string]: string };
};

function mapDataRequest(variables: MapRequestParam): GraphQLRequest {
  return {
    operationName: "MapData",
    query: `query MapData($mapId: ID!) {
      Map(id: $mapId) {
        id, name, description, image
      }
    }`,
    variables
  };
}

function allMapsRequest(): GraphQLRequest {
  return {
    operationName: "AllMaps",
    query: `query AllMaps {
      allMaps { id, updatedAt }
    }`,
  };
}

type MapData = {
  id: string;
  name: string;
  description: string;
  image: string;
};

function requestGraphQL(param: MapRequestParam): Promise<MapData> {
  return request
    .post({
      uri: graphql_root,
      body: mapDataRequest(param),
      json: true
    })
    .then(body => body.data.Map);
}

type PartialMap = {
  id: string;
  updatedAt: number;
};

function requestAllMaps(): Promise<PartialMap[]> {
  return request
    .post({
      uri: graphql_root,
      body: allMapsRequest(),
      json: true
    })
    .then(body => body.data.allMaps)
    .then(maps => maps.map(({ id, updatedAt }) => ({ id, updatedAt: +moment(updatedAt) })));
}

const DATE_FORMAT = "YYYY-MM-DD";

const sortByUpdatedTimeDesc = sort((a: PartialMap, b: PartialMap) => b.updatedAt - a.updatedAt);

function toSitemapUrl(map: PartialMap): string {
  const id = map.id;
  const today = moment().format(DATE_FORMAT);
  const lastmod = moment(map.updatedAt).format(DATE_FORMAT);
  return (
    `<url>
      <loc>https://sense.tw/map/${id}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>${lastmod === today ? 'hourly' : 'daily'}</changefreq>
    </url>`
  );
}

function toSitemap(maps: PartialMap[]): string {
  const sortedMaps = sortByUpdatedTimeDesc(maps);
  const today = moment().format(DATE_FORMAT);
  // use the first map update time as the site update time
  const lastmod =
    moment((sortedMaps[0] || { updatedAt: 0 }).updatedAt).format(DATE_FORMAT);
  return (
    `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://sense.tw</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>${lastmod === today ? 'hourly' : 'daily'}</changefreq>
      </url>
      ${sortedMaps.map(toSitemapUrl).join('')}
    </urlset>`
  );
}

type ResponseData = {
  name: string;
  title: string;
  description: string;
  image: string;
  image_secure: string;
  url: string;
  favicon: string;
};

const siteData: ResponseData = {
  name: "Sense.tw",
  title: "Sense.tw",
  description:
    "議題釐清工具，社群協作讓政策 make sense 。用 Sense.tw 標注文件和網頁，收集、分類、萃取大量資訊中的重點，視覺化拉出多重議題架構，找出問題關鍵！",
  image: "http://sense.tw/tree.png",
  image_secure: "https://sense.tw/tree.png",
  url: "http://sense.tw/",
  favicon: "https://sense.tw/favicon-96x96.png"
};

function mapDataToResponse(data: MapData): ResponseData {
  return {
    name: "Sense.tw",
    title: `${data.name} - Sense.tw`,
    description: data.description,
    image: data.image || siteData.image,
    image_secure: data.image.replace(/^http:/, 'https:') || siteData.image_secure,
    url: `http://sense.tw/map/${data.id}`,
    favicon: siteData.favicon,
  };
}

function formatResponse(data: ResponseData): string {
  const content = fs
    .readFileSync(path.join(__dirname, "../public/index.html"))
    .toString();
  return content.replace(
    new RegExp("{(" + Object.keys(data).join("|") + ")}", "g"),
    (r, substr) => data[substr]
  );
}

const server = http.createServer((req, res) => {
  const param = parseRequest(req);
  debug(param);
  switch (param.type) {
    case RequestType.MAP:
      return requestGraphQL(param)
        .then(mapData => res.end(formatResponse(mapDataToResponse(mapData))))
        .catch(error => console.error(error));
    case RequestType.SITEMAP:
      return requestAllMaps()
        .then(maps => {
          res.setHeader('Content-Type', 'application/xml');
          res.end(toSitemap(maps));
        })
        .catch(error => console.error(error));
    case RequestType.INDEX:
    default:
      return res.end(formatResponse(siteData));
  }
});

server.listen(port, () => console.log(`Listening at port ${port}`));
