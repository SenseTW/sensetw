import { CardID, CardType } from './sense-card';
import { BoxID } from './sense-box';
import { TimeStamp } from './utils';

export type ObjectID = string;

export enum ObjectType {
  Card,
  Box
}

interface BaseObjectData {
  id: ObjectID;
  createdAt: TimeStamp;
  updatedAt: TimeStamp;
  title: string;
  summary: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  // map: MapID[];
  belongsTo?: BoxID;
}

export interface CardObjectData extends BaseObjectData {
  objectType: ObjectType.Card;
  card: CardID;
  cardType: CardType;
  saidBy: string;
  stakeholder: string;
  url: string;
}

export interface BoxObjectData extends BaseObjectData {
  objectType: ObjectType.Box;
  box: BoxID;
  contains: { [key: string]: ObjectData };
}

export type ObjectData
  = CardObjectData
  | BoxObjectData;
