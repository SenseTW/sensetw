import { ObjectID } from './sense-object';
import { TimeStamp, Color } from './utils';

export type BoxID = string;

export interface BoxData {
  id: BoxID;
  createdAt: TimeStamp;
  updatedAt: TimeStamp;
  title: string;
  color: Color;
  objects?: ObjectID[];
  contains: ObjectID[];
}