import * as dotenv from "dotenv";
dotenv.load();
import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import * as request from "request-promise-native";
import * as Debug from "debug";

const debug = Debug("smo");
const port = process.env.PORT || "8001";
const graphql_root =
  process.env.SENSEMAP_GRAPHQL_ROOT || "https://api.sense.tw/graphql";

type MapRequestParam = {
  mapId: string;
  boxId?: string;
};

function parseRequest(req: http.IncomingMessage): MapRequestParam | null {
  const parts = req.url.split("/");
  switch (parts.length) {
    case 3: {
      return { mapId: parts[2] };
    }
    case 5: {
      return { mapId: parts[2], boxId: parts[4] };
    }
    default: {
      return null;
    }
  }
}

type GraphQLRequest = {
  operationName: string;
  query: string;
  variables: { [key: string]: string };
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
  if (param === null) {
    return res.end(formatResponse(siteData));
  } else {
    return requestGraphQL(param)
      .then(mapData => res.end(formatResponse(mapDataToResponse(mapData))))
      .catch(error => console.error(error));
  }
});

server.listen(port, () => console.log(`Listening at port ${port}`));
