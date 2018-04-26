import { ObjectID } from './sense-object';
import { TimeStamp } from './utils';

export type BoxID = string;

export interface BoxData {
  id: BoxID;
  createdAt: TimeStamp;
  updatedAt: TimeStamp;
  objects: { [key: string]: ObjectID };
  title: string;
  summary: string;
  contains: { [key: string]: ObjectID };
}
