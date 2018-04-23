import { CardID } from './sense-card';
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
}

export interface BoxObjectData extends BaseObjectData {
  objectType: ObjectType.Box;
  box: BoxID;
}

export type ObjectData
  = CardObjectData
  | BoxObjectData;