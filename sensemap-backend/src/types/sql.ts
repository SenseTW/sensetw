export type ID = string;

export type HasID = {
  id: ID,
};

export type HasTimestamps = {
  createdAt: Date,
  updatedAt: Date,
}

const hasTimestampFields = [ 'id', 'createdAt', 'updatedAt' ];

export type Map = HasID & HasTimestamps & {};

export const mapFields = [ ...hasTimestampFields ];

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

export const objectFields = [ ...hasTimestampFields, ...objectDataFields ];

export type CardType = 'NORMAL' | 'QUESTION' | 'ANSWER' | 'NOTE';

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
}

export const cardDataFields = [ 'cardType', 'description', 'saidBy', 'stakeholder', 'summary', 'tags', 'title', 'url', 'mapId' ];

export const cardFields = [ ...hasTimestampFields, ...cardDataFields ];

export type Box = HasID & HasTimestamps & {
  title: string,
  summary: string,
  tags: string,
  mapId: ID,
}

export const boxDataFields = [ 'title', 'summary', 'tags', 'mapId' ];

export const boxFields = [ ...hasTimestampFields, ...boxDataFields ];

export type Edge = HasID & HasTimestamps & {
  mapId: ID,
  fromId: ID,
  toId: ID,
}

export const edgeDataFields = [ 'mapId', 'fromId', 'toId' ];

export const edgeFields = [ ...hasTimestampFields, ...edgeDataFields ];
