import * as dotenv from "dotenv";
dotenv.config();

import * as Knex from "knex";

export const db = Knex({
  client: "pg",
  connection: process.env.DATABASE_URL,
  //debug: env.NODE_ENV === 'development',
  seeds: {
    directory: "./seeds/dev"
  }
});

export type ID = string;

export type HasID = {
  id: ID;
};

export type HasTimestamps = {
  createdAt: Date;
  updatedAt: Date;
};

const hasTimestampFields = ["id", "createdAt", "updatedAt"];

export type UserData = {
  username: string;
  email: string;
};

export type User = HasID & HasTimestamps & UserData;

export const userFields = [
  ...hasTimestampFields,
  "username",
  "email",
  db.raw(
    "array(?) as maps",
    db
      .select("id")
      .from("map")
      .whereRaw('"map"."ownerId" = "user"."id"')
  )
] as string[];

export type Map = HasID &
  HasTimestamps & {
    name: string;
    description: string;
    tags: string;
    image: string;
    type: string;
    owner: ID;
    objects: HasID[];
    cards: HasID[];
    boxes: HasID[];
    edges: HasID[];
  };

export const mapDataFields = [
  "name",
  "description",
  "tags",
  "image",
  "type",
  "ownerId"
];

export const mapFields = [
  ...hasTimestampFields,
  ...mapDataFields,
  db.raw('"ownerId" as owner'),
  db.raw(
    "array(?) as objects",
    db
      .select("id")
      .from("object")
      .whereRaw('"object"."mapId" = "map"."id"')
  ),
  db.raw(
    "array(?) as cards",
    db
      .select("id")
      .from("card")
      .whereRaw('"card"."mapId" = "map"."id"')
  ),
  db.raw(
    "array(?) as boxes",
    db
      .select("id")
      .from("box")
      .whereRaw('"box"."mapId" = "map"."id"')
  ),
  db.raw(
    "array(?) as edges",
    db
      .select("id")
      .from("edge")
      .whereRaw('"edge"."mapId" = "map"."id"')
  )
] as string[];

export type ObjectType = "CARD" | "BOX";

export type SenseObject = HasID &
  HasTimestamps & {
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    mapId: ID;
    objectType: ObjectType;
    cardId: ID;
    boxId: ID;
    belongsToId: ID;
  };

export const objectDataFields = [
  "x",
  "y",
  "width",
  "height",
  "zIndex",
  "mapId",
  "objectType",
  "cardId",
  "boxId",
  "belongsToId"
];

export const objectFields = [
  ...hasTimestampFields,
  ...objectDataFields,
  db.column("mapId").as("map"),
  db.column("boxId").as("box"),
  db.column("cardId").as("card"),
  db.column("belongsToId").as("belongsTo")
] as string[];

export type CardType = "NOTE" | "PROBLEM" | "SOLUTION" | "DEFINITION" | "INFO";

export type Card = HasID &
  HasTimestamps & {
    cardType: CardType;
    description: string;
    saidBy: string;
    stakeholder: string;
    summary: string;
    quote: string;
    tags: string;
    title: string;
    url: string;
    mapId: ID;
    ownerId: ID;
  };

export const cardDataFields = [
  "cardType",
  "description",
  "saidBy",
  "stakeholder",
  "summary",
  "quote",
  "tags",
  "title",
  "url",
  "mapId",
  "ownerId"
];

export const cardFields = [
  ...hasTimestampFields,
  ...cardDataFields,
  db.column("mapId").as("map"),
  db.column("ownerId").as("owner"),
  db.raw(
    "array(?) as objects",
    db
      .select("id")
      .from("object")
      .whereRaw('"cardId" = "card"."id"')
  )
] as string[];

export const cardWithTargetFields = [
  ...cardFields,
  db.raw(
    '? as "annotationID"',
    db
      .select("id")
      .from("annotation")
      .whereRaw('"cardId" = "card"."id"')
  ),
  db.raw(
    "? as target",
    db
      .select("target")
      .from("annotation")
      .whereRaw('"cardId" = "card"."id"')
  )
] as string[];

export type BoxType = "NOTE" | "PROBLEM" | "SOLUTION" | "DEFINITION" | "INFO";

export type Box = HasID &
  HasTimestamps & {
    boxType: BoxType;
    title: string;
    summary: string;
    tags: string;
    mapId: ID;
    ownerId: ID;
  };

export const boxDataFields = [
  "boxType",
  "title",
  "summary",
  "tags",
  "mapId",
  "ownerId"
];

export const boxFields = [
  ...hasTimestampFields,
  ...boxDataFields,
  db.column("mapId").as("map"),
  db.column("ownerId").as("owner"),
  db.raw(
    "array(?) as objects",
    db
      .select("id")
      .from("object")
      .whereRaw('"object"."boxId" = "box"."id"')
  ),
  db.raw(
    "array(?) as contains",
    db
      .select("id")
      .from("object")
      .whereRaw('"object"."belongsToId" = "box"."id"')
  )
] as string[];

export type EdgeType = "NONE" | "DIRECTED" | "REVERSED" | "BIDIRECTED";

export type Edge = HasID &
  HasTimestamps & {
    mapId: ID;
    fromId: ID;
    toId: ID;
    edgeType: EdgeType;
    title: string;
    tags: string;
    summary: string;
  };

export const edgeDataFields = ["mapId", "fromId", "toId", "edgeType", "title", "tags", "summary"];

export const edgeFields = [
  ...hasTimestampFields,
  ...edgeDataFields,
  db.column("mapId").as("map"),
  db.column("fromId").as("from"),
  db.column("toId").as("to")
] as string[];

export type Annotation = HasID &
  HasTimestamps & {
    target: any[];
    document: any;
    mapId: ID;
    cardId: ID;
    card?: Card;
  };

export const annotationDataFields = ["target", "document", "mapId", "cardId"];

export const annotationFields = [
  ...hasTimestampFields,
  ...annotationDataFields
] as string[];

export type HistoryType = "MAP" | "OBJECT";

export const historyDataFields = ["userId", "mapId", "objectId", "data"];

export type History = HasID &
  HasTimestamps & {
    userId: ID;
    historyType: HistoryType;
    mapId: ID;
    objectId: ID;
    data: any;
  };
