import { ObjectType, BaseObjectData, ObjectData } from './sense-object';

export type BoxID = string;

export interface BoxData extends BaseObjectData {
  objectType: ObjectType.Box;
  // XXX: wait for something like opaque type in Flow to describe them properly
  box: BoxID;
  contains: { [key: string]: ObjectData };
}