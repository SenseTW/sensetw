import { CardData } from './sense-card';
import { BoxID, BoxData } from './sense-box';
import { TimeStamp } from './utils';

export type ObjectID = string;

export enum ObjectType {
  Card,
  Box
}

export interface BaseObjectData {
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
  belongsTo?: BoxID;
}

export const emptyObjectData = {
  id: '0',
  createdAt: 0,
  updatedAt: 0,
  title: '',
  summary: '',
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  zIndex: 0
};

// re-export types
export type CardData = CardData;
export type BoxData = BoxData;

export type ObjectData
  = CardData
  | BoxData;
