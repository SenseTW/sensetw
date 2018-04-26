import { BoxID } from './sense-box';
import { TimeStamp } from './utils';

export type ObjectID = string;

export enum ObjectType {
  None,
  Card,
  Box,
}

export interface ObjectData {
  id: ObjectID;
  createdAt: TimeStamp;
  updatedAt: TimeStamp;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  belongsTo?: BoxID;
  objectType: ObjectType;
  data: CardID | BoxID;
}

export const emptyObjectData = {
  id: '0',
  createdAt: 0,
  updatedAt: 0,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  zIndex: 0,
  objectType: ObjectType.None,
  data: '0',
};
