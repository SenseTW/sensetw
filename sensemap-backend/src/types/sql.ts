import * as dotenv from "dotenv";
dotenv.config();
import * as Knex from "knex";
import { pick } from "ramda";
import { ObjectType, CardType, BoxType, HistoryType, EdgeType } from "./primitive";

export const db = Knex({
  client: "pg",
  connection: process.env.DATABASE_URL,
  //debug: env.NODE_ENV === 'development',
  seeds: {
    directory: "./seeds/dev"
  }
});

export type Db = typeof db;

export type ID = string;

export type HasID = {
  id: ID;
};

const hasIDFields = ["id"];

type HasTimestamps = {
  createdAt: Date;
  updatedAt: Date;
};

const hasTimestampsFields = ["createdAt", "updatedAt"];

/**
 * Type for updating users.
 */
export type UserData = {
  username: string;
  email: string;
};

/**
 * SQL fields for updating users.
 */
export const userDataFields: (keyof UserData)[] = ["username", "email"];

export function userData(args: any): Partial<UserData> {
  return pick(userDataFields, args);
}

/**
 * Type for querying users.
 */
export type User = HasID & HasTimestamps & UserData;

/**
 * SQL fields for querying users.
 */
export const userFields = [
  ...hasIDFields,
  ...hasTimestampsFields,
  ...userDataFields,
] as string[];

/**
 * SQL for querying users.
 */
export function usersQuery(db: Knex): Knex.QueryBuilder {
  return db.select(userFields).from("user");
}

/**
 * Type for updating maps.
 */
export type MapData = {
  name: string;
  description: string;
  tags: string;
  image: string;
  type: string;
  ownerId: ID;
};

/**
 * SQL fields for updating maps.
 */
export const mapDataFields: (keyof MapData)[] = [
  "name",
  "description",
  "tags",
  "image",
  "type",
  "ownerId"
];

/**
 * Data constructor for updating maps.
 */
export function mapData(args: any): Partial<MapData> {
  return pick<any, keyof MapData>(mapDataFields, args);
}

/**
 * Type for querying maps.
 */
export type Map = HasID &
  HasTimestamps & {
    name: string;
    description: string;
    tags: string;
    image: string;
    type: string;
    ownerId: ID;
  };

/**
 * SQL fields for querying maps.
 */
export const mapFields = [
  ...hasIDFields,
  ...hasTimestampsFields,
  ...mapDataFields
] as string[];

/**
 * SQL for querying maps.
 */
export function mapsQuery(db: Knex): Knex.QueryBuilder {
  return db.select(mapFields).from("map");
}

/**
 * Type for updating objects.
 */
export type ObjectData = {
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

/**
 * SQL fields for updating objects.
 */
export const objectDataFields: (keyof ObjectData)[] = [
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

/**
 * Data constructor for updating objects.
 */
export function objectData(args: any): Partial<ObjectData> {
  return pick<any, keyof ObjectData>(objectDataFields, args);
}

/**
 * Type for querying objects.
 */
export type SenseObject = HasID & HasTimestamps & ObjectData;

/**
 * SQL fields for querying objects.
 */
export const objectFields = [
  ...hasIDFields,
  ...hasTimestampsFields,
  ...objectDataFields
] as string[];

/**
 * SQL for querying objects.
 */
export function objectsQuery(db: Knex): Knex.QueryBuilder {
  return db.select(objectFields).from("object");
}

export type CardData = {
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

/**
 * SQL fields for updating cards.
 */
export const cardDataFields: (keyof CardData)[] = [
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

/**
 * Data constructor for updating cards.
 */
export function cardData(args: any): Partial<CardData> {
  return pick<any, keyof CardData>(cardDataFields, args);
}

/**
 * Type for querying cards.
 */
export type Card = HasID & HasTimestamps & CardData;

/**
 * SQL fields for querying cards.
 */
export const cardFields = [
  ...hasIDFields,
  ...hasTimestampsFields,
  ...cardDataFields,
] as string[];

/**
 * SQL for querying cards.
 */
export function cardsQuery(db: Knex): Knex.QueryBuilder {
  return db.select(cardFields).from("card");
}

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

/**
 * Type for updating boxes.
 */
export type BoxData = {
  boxType: BoxType;
  title: string;
  summary: string;
  tags: string;
  mapId: ID;
  ownerId: ID;
};

/**
 * SQL fields for updating boxes.
 */
export const boxDataFields: (keyof BoxData)[] = [
  "boxType",
  "title",
  "summary",
  "tags",
  "mapId",
  "ownerId"
];

/**
 * Data constructor for updating boxes.
 */
export function boxData(args: any): Partial<BoxData> {
  return pick<any, keyof BoxData>(boxDataFields, args);
}

/**
 * Type for querying boxes.
 */
export type Box = HasID &
  HasTimestamps & {
    boxType: BoxType;
    title: string;
    summary: string;
    tags: string;
    mapId: ID;
    ownerId: ID;
  };

/**
 * SQL fields for querying boxes.
 */
export const boxFields = [
  ...hasIDFields,
  ...hasTimestampsFields,
  ...boxDataFields,
  db.column("mapId").as("map"),
  db.column("ownerId").as("owner"),
] as string[];

/**
 * SQL for querying boxes.
 */
export function boxesQuery(db: Knex): Knex.QueryBuilder {
  return db.select(boxFields).from("box");
}

/**
 * Type for updating edges
 */
export type EdgeData ={
  mapId: ID;
  fromId: ID;
  toId: ID;
  edgeType: EdgeType;
  title: string;
  tags: string;
  summary: string;
};

/**
 * SQL fields for updating edges.
 */
export const edgeDataFields: (keyof EdgeData)[] = [
  "mapId",
  "fromId",
  "toId",
  "edgeType",
  "title",
  "tags",
  "summary"
];

export function edgeData(args: any): Partial<EdgeData> {
  return pick<any, keyof EdgeData>(edgeDataFields, args);
}

/**
 * Type for querying edges.
 */
export type Edge = HasID & HasTimestamps & EdgeData;

/**
 * SQL fields for querying edges.
 */
export const edgeFields = [
  ...hasIDFields,
  ...hasTimestampsFields,
  ...edgeDataFields,
  db.column("mapId").as("map"),
  db.column("fromId").as("from"),
  db.column("toId").as("to")
] as string[];

/**
 * SQL for querying edges.
 */
export function edgesQuery(db: Knex): Knex.QueryBuilder {
  return db.select(edgeFields).from("edge");
}

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
  ...hasIDFields,
  ...hasTimestampsFields,
  ...annotationDataFields
] as string[];

export const historyDataFields = ["userId", "mapId", "objectId", "data"];

export type History = HasID &
  HasTimestamps & {
    historyType: HistoryType;
    userId: ID;
    mapId: ID;
    objectId: ID;
    cardId: ID;
    changes: any[];
  };
