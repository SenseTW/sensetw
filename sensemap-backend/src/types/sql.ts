export type ID = string;

export type HasID = {
  id: ID,
};

export type HasTimestamps = {
  createdAt: Date,
  updatedAt: Date,
}

const hasTimestampFields = [ 'id', 'createdAt', 'updatedAt' ];

export type UserData = {
  username: string,
  email: string,
};

export type User = HasID & HasTimestamps & UserData;

export const userFields = (db) => [
  ...hasTimestampFields,
  'username',
  'email',
  db.raw('array(?) as maps', db.select('id').from('map').whereRaw('"map"."ownerId" = "user"."id"')),
];

export type Map = HasID & HasTimestamps & {
  name: string,
  description: string,
  tags: string,
  image: string,
  type: string,
  owner: ID,
  objects: HasID[],
  cards: HasID[],
  boxes: HasID[],
  edges: HasID[],
};

export const mapDataFields = [ 'name', 'description', 'tags', 'image', 'type', 'ownerId' ];

export const mapFields = (db) => [
  ...hasTimestampFields,
  ...mapDataFields,
  db.raw('"ownerId" as owner'),
  db.raw('array(?) as objects', db.select('id').from('object').whereRaw('"object"."mapId" = "map"."id"')),
  db.raw('array(?) as cards', db.select('id').from('card').whereRaw('"card"."mapId" = "map"."id"')),
  db.raw('array(?) as boxes', db.select('id').from('box').whereRaw('"box"."mapId" = "map"."id"')),
  db.raw('array(?) as edges', db.select('id').from('edge').whereRaw('"edge"."mapId" = "map"."id"')),
];

export type ObjectType = 'CARD' | 'BOX';

export type SenseObject = HasID & HasTimestamps & {
  x: number,
  y: number,
  width: number,
  height: number,
  zIndex: number,
  mapId: ID,
  objectType: ObjectType,
  cardId: ID,
  boxId: ID,
  belongsToId: ID,
}

export const objectDataFields = [ 'x', 'y', 'width', 'height', 'zIndex', 'mapId', 'objectType', 'cardId', 'boxId', 'belongsToId' ];

export const objectFields = (db) => [
  ...hasTimestampFields,
  ...objectDataFields,
  db.column('mapId').as('map'),
  db.column('boxId').as('box'),
  db.column('cardId').as('card'),
  db.column('belongsToId').as('belongsTo'),
];

export type CardType = 'NORMAL' | 'QUESTION' | 'ANSWER' | 'NOTE' | 'PROBLEM' | 'SOLUTION' | 'DEFINITION' | 'INFO';

export type Card = HasID & HasTimestamps & {
  cardType: CardType,
  description: string,
  saidBy: string,
  stakeholder: string,
  summary: string,
  tags: string,
  title: string,
  url: string,
  mapId: ID,
  ownerId: ID,
}

export const cardDataFields = [ 'cardType', 'description', 'saidBy', 'stakeholder', 'summary', 'tags', 'title', 'url', 'mapId', 'ownerId' ];

export const cardFields = (db) => [
  ...hasTimestampFields,
  ...cardDataFields,
  db.column('mapId').as('map'),
  db.column('ownerId').as('owner'),
  db.raw('array(?) as objects', db.select('id').from('object').whereRaw('"cardId" = "card"."id"')),
];

export const cardWithTargetFields = (db) => [
  ...cardFields(db),
  db.raw('? as "annotationID"', db.select('id').from('annotation').whereRaw('"cardId" = "card"."id"')),
  db.raw('? as target', db.select('target').from('annotation').whereRaw('"cardId" = "card"."id"')),
];

export type BoxType = 'NOTE' | 'PROBLEM' | 'SOLUTION' | 'DEFINITION' | 'INFO';

export type Box = HasID & HasTimestamps & {
  boxType: BoxType,
  title: string,
  summary: string,
  tags: string,
  mapId: ID,
}

export const boxDataFields = [ 'boxType', 'title', 'summary', 'tags', 'mapId' ];

export const boxFields = (db) => [
  ...hasTimestampFields,
  ...boxDataFields,
  db.column('mapId').as('map'),
  db.raw('array(?) as objects', db.select('id').from('object').whereRaw('"object"."boxId" = "box"."id"')),
  db.raw('array(?) as contains', db.select('id').from('object').whereRaw('"object"."belongsToId" = "box"."id"')),
];

export type Edge = HasID & HasTimestamps & {
  mapId: ID,
  fromId: ID,
  toId: ID,
}

export const edgeDataFields = [ 'mapId', 'fromId', 'toId' ];

export const edgeFields = (db) => [
  ...hasTimestampFields,
  ...edgeDataFields,
  db.column('mapId').as('map'),
  db.column('fromId').as('from'),
  db.column('toId').as('to'),
];

export type Annotation = HasID & HasTimestamps & {
  target: any[],
  document: any,
  mapId: ID,
  cardId: ID,
  card?: Card,
};

export const annotationDataFields = [ 'target', 'document', 'mapId', 'cardId' ];

export const annotationFields = (db) => [
  ...hasTimestampFields,
  ...annotationDataFields,
];
