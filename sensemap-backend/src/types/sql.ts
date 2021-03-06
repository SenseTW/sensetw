import * as dotenv from "dotenv";
dotenv.config();
import * as Knex from "knex";
import { pick } from "ramda";
import {
  ObjectType,
  CardType,
  BoxType,
  HistoryType,
  EdgeType
} from "./primitive";

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

export type HasTimestamps = {
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

/**
 * Data constructor for updating users.
 */
export function userData(args: UserData): UserData {
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
  ...userDataFields
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
export function mapData(args: MapData): MapData {
  return pick(mapDataFields, args);
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
  return db.select(mapFields).from("map").where('deletedAt', null);
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
export function objectData(args: ObjectData): ObjectData {
  return pick(objectDataFields, args);
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
  return db.select(objectFields).from("object").where('deletedAt', null);
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
export function cardData(args: CardData): CardData {
  return pick(cardDataFields, args);
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
  ...cardDataFields
] as string[];

/**
 * SQL for querying cards.
 */
export function cardsQuery(db: Knex): Knex.QueryBuilder {
  return db.select(cardFields).from("card").where('deletedAt', null);
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
export function boxData(args: BoxData): BoxData {
  return pick(boxDataFields, args);
}

/**
 * Type for querying boxes.
 */
export type Box = HasID & HasTimestamps & BoxData;

/**
 * SQL fields for querying boxes.
 */
export const boxFields = [
  ...hasIDFields,
  ...hasTimestampsFields,
  ...boxDataFields,
] as string[];

/**
 * SQL for querying boxes.
 */
export function boxesQuery(db: Knex): Knex.QueryBuilder {
  return db.select(boxFields).from("box").where('deletedAt', null);
}

/**
 * Type for updating edges
 */
export type EdgeData = {
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

/**
 * Data constructor for updating edges.
 */
export function edgeData(args: EdgeData): EdgeData {
  return pick(edgeDataFields, args);
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
] as string[];

/**
 * SQL for querying edges.
 */
export function edgesQuery(db: Knex): Knex.QueryBuilder {
  return db.select(edgeFields).from("edge").where('deletedAt', null);
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

/**
 * Type for updating histories.
 */
export type HistoryData = {
  historyType: HistoryType;
  transactionId: ID;
  userId: ID;
  mapId: ID;
  objectId: ID;
  cardId: ID;
  changes: any[];
};

/**
 * SQL fields for updating histories.
 */
export const historyDataFields: (keyof HistoryData)[] = [
  "historyType",
  "transactionId",
  "userId",
  "mapId",
  "objectId",
  "cardId",
  "changes"
];

/**
 * Data constructor for updating histories.
 */
export function historyData(args: HistoryData): HistoryData {
  return pick(historyDataFields, args);
}

/**
 * Type for reading histories.
 */
export type History = HasID & HasTimestamps & HistoryData;

/**
 * SQL fields for reading histories.
 */
export const historyFields = [
  ...hasIDFields,
  ...hasTimestampsFields,
  ...historyDataFields
] as string[];

/**
 * SQL for reading histories.
 */
export function historiesQuery(db: Knex): Knex.QueryBuilder {
  return db.select(historyFields).from("history");
}
