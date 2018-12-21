import { ActionUnion, emptyAction } from '../action';
import { HasID } from './has-id';
import { Position, Dimension, AnchorType, Anchor } from '../../graphics/drawing';
import { ObjectType } from './object-type';
import { TimeStamp } from '../utils';
import { CardID } from './card';
import { BoxID } from './box';
import * as moment from 'moment';

export { ObjectType } from './object-type';

export type ObjectID = string;

/**
 * A container to hold cards and boxes for maps.
 *
 * @extends {HasID<ObjectID>}
 */
export interface ObjectData extends HasID<ObjectID>, Position, Dimension, Anchor {
  createdAt:  TimeStamp;
  updatedAt:  TimeStamp;
  zIndex:     number;
  objectType: ObjectType;
  belongsTo?: BoxID;
  data:       CardID | BoxID;
}

/**
 * An empty object. The null value of the `ObjectData`.
 *
 * @todo We should have an `isEmpty` function if we want to
 * serialize/deserialize them in the future.
 */
export const emptyObjectData = {
  id: '0',
  createdAt: 0,
  updatedAt: 0,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  anchor: AnchorType.CENTER,
  zIndex: 0,
  objectType: ObjectType.NONE,
  data: '0',
};

/**
 * A subset of `ObjectData`.
 */
interface PartialObjectData {
  id?:         ObjectID;
  x?:          number;
  y?:          number;
  width?:      number;
  height?:     number;
  anchor?:     AnchorType;
  zIndex?:     number;
  objectType?: ObjectType;
  data?:       CardID | BoxID;
}

/**
 * It uses a partial object data to create a new object data at the current moment.
 *
 * One can treat this as a data constructor for `ObjectData` with side-effects.
 *
 * @param {PartialObjectData} partial The partial object data. It defaults to an empty object.
 */
export const objectData = (partial: PartialObjectData = {}): ObjectData => {
  const now = +moment();

  return {
    ...emptyObjectData,
    ...partial,
    createdAt: now,
    updatedAt: now,
  };
};

const UPDATE_POSITION = 'UPDATE_POSITION';
/**
 * It updates the position(x, y) of the given object.
 *
 * @param {number} x
 * @param {number} y
 * @todo A `Point` version.
 */
export const updatePosition =
  (x: number, y: number) => ({
    type: UPDATE_POSITION as typeof UPDATE_POSITION,
    payload: { x, y },
  });

const UPDATE_DIMENSION = 'UPDATE_DIMENSION';
/**
 * It updates the dimension(width, height) of the given object.
 *
 * @param {number} width
 * @param {number} height
 * @todo A `Point` version.
 */
export const updateDimension =
  (width: number, height: number) =>
  ({
    type: UPDATE_DIMENSION as typeof UPDATE_DIMENSION,
    payload: { width, height },
  });

const UPDATE_Z_INDEX = 'UPDATE_Z_INDEX';
/**
 * It updates the z index of the given object.
 *
 * @param {number} zIndex
 */
export const updateZIndex =
  (zIndex: number) =>
  ({
    type: UPDATE_Z_INDEX as typeof UPDATE_Z_INDEX,
    payload: { zIndex },
  });

const UPDATE_OBJECT_TYPE = 'UPDATE_OBJECT_TYPE'; // TODO
/**
 * It updates the object type of the given object.
 *
 * @param {ObjectType} objectType
 */
export const updateObjectType =
  (objectType: ObjectType) =>
  ({
    type: UPDATE_OBJECT_TYPE as typeof UPDATE_OBJECT_TYPE,
    payload: { objectType },
  });

export const types = {
  UPDATE_POSITION,
  UPDATE_DIMENSION,
};

/**
 * The data constructors of object actions.
 */
export const actions = {
  updatePosition,
  updateDimension,
};

export type Action = ActionUnion<typeof actions>;

/**
 * The action dispatcher for object actions.
 *
 * @param {ObjectData} state An object.
 * @param {Action} action Object actions.
 */
export const reducer = (state: ObjectData = emptyObjectData, action: Action = emptyAction): ObjectData => {
  switch (action.type) {
    case UPDATE_POSITION: {
      const { x, y } = action.payload;
      return { ...state, x, y };
    }
    case UPDATE_DIMENSION: {
      const { width, height } = action.payload;
      return { ...state, width, height };
    }
    default: {
      return state;
    }
  }
};
