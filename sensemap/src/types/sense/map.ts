import { HasID } from '../sense/has-id';
import { UserData, anonymousUserData } from './user';
import { TimeStamp } from '../utils';
import { ActionUnion, emptyAction } from '../action';
import * as moment from 'moment';

export type MapID = string;

export enum MapType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export interface MapData extends HasID<MapID> {
  createdAt: TimeStamp;
  updatedAt: TimeStamp;
  type: MapType;
  name: string;
  description: string;
  tags: string;
  owner: UserData;
  // members: User[];
  image: string;
}

export type PartialMapData = Partial<MapData>;

export const emptyMapData: MapData = {
  id: '0',
  createdAt: 0,
  updatedAt: 0,
  type: MapType.PUBLIC,
  name: '',
  description: '',
  tags: '',
  image: '',
  owner: anonymousUserData,
};

export const mapData = (partial: PartialMapData = {}): MapData => {
  const now = +moment();

  return {
    ...emptyMapData,
    ...partial,
    createdAt: now,
    updatedAt: now,
  };
};

const UPDATE_MAP_TYPE = 'UPDATE_MAP_TYPE';
export const updateType =
  (type: MapType) => ({
    type: UPDATE_MAP_TYPE as typeof UPDATE_MAP_TYPE,
    payload: { type },
  });

const UPDATE_MAP_NAME = 'UPDATE_MAP_NAME';
export const updateName =
  (name: string) => ({
    type: UPDATE_MAP_NAME as typeof UPDATE_MAP_NAME,
    payload: { name },
  });

const UPDATE_MAP_DESCRIPTION = 'UPDATE_MAP_DESCRIPTION';
export const updateDescription =
  (description: string) => ({
    type: UPDATE_MAP_DESCRIPTION as typeof UPDATE_MAP_DESCRIPTION,
    payload: { description },
  });

const UPDATE_MAP_TAGS = 'UPDATE_MAP_TAGS';
export const updateTags =
  (tags: string) => ({
    type: UPDATE_MAP_TAGS as typeof UPDATE_MAP_TAGS,
    payload: { tags },
  });

const UPDATE_MAP_IMAGE = 'UPDATE_MAP_IMAGE';
export const updateImage =
  (image: string) => ({
    type: UPDATE_MAP_IMAGE as typeof UPDATE_MAP_IMAGE,
    payload: { image },
  });

export const actions = {
  updateType,
  updateName,
  updateDescription,
  updateTags,
  updateImage,
};

export type Action = ActionUnion<typeof actions>;

export const reducer = (state: MapData = emptyMapData, action: Action = emptyAction): MapData => {
  switch (action.type) {
    case UPDATE_MAP_TYPE: {
      const { type } = action.payload;
      return { ...state, type };
    }
    case UPDATE_MAP_NAME: {
      const { name } = action.payload;
      return { ...state, name };
    }
    case UPDATE_MAP_DESCRIPTION: {
      const { description } = action.payload;
      return { ...state, description };
    }
    case UPDATE_MAP_TAGS: {
      const { tags } = action.payload;
      return { ...state, tags };
    }
    case UPDATE_MAP_IMAGE: {
      const { image } = action.payload;
      return { ...state, image };
    }
    default:
      return state;
  }
};
