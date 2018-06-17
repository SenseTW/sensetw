import { HasID } from './has-id';
import { ObjectID } from './object';
import { TimeStamp } from '../utils';
import { ActionUnion, emptyAction } from '../action';
import * as moment from 'moment';

export type BoxID = string;

/**
 * The default width of a box on the sense map.
 *
 * @todo Move it to the map.
 */
export const DEFAULT_WIDTH  = 320;
/**
 * The default height of a box on the sense map.
 *
 * @todo Move it to the map.
 */
export const DEFAULT_HEIGHT = 130; // 90px + 24px for tags

/**
 * It describes a box.
 *
 * @extends {HasID<BoxID>}
 */
export interface BoxData extends HasID<BoxID> {
  createdAt: TimeStamp;
  updatedAt: TimeStamp;
  objects: { [key: string]: { id: ObjectID } };
  title: string;
  summary: string;
  tags: string;
  contains: { [key: string]: { id: ObjectID } };
}

/**
 * The partial box.
 */
interface PartialBoxData {
  id?: BoxID;
  createdAt?: TimeStamp;
  updatedAt?: TimeStamp;
  title?: string;
  summary?: string;
  tags?: string;
}

/**
 * An empty box.
 *
 * One can treat it like a null value of the box type.
 *
 * @todo Add an `isEmpty` function if we want to serialize/deserialize them.
 */
export const emptyBoxData: BoxData = {
  id: '0',
  createdAt: 0,
  updatedAt: 0,
  objects: {},
  title: '',
  summary: '',
  tags: '',
  contains: {}
};

/**
 * It creates a new box from a partial box data at the current moment.
 *
 * @param {PartialBoxData} partial The partial box. It defaults to an empty
 * object.
 */
export const boxData = (partial: PartialBoxData = {}): BoxData => {
  const now = +moment();

  return {
    ...emptyBoxData,
    ...partial,
    createdAt: now,
    updatedAt: now,
  };
};

const UPDATE_BOX_TITLE = 'UPDATE_BOX_TITLE';
/**
 * It updates the title of the given box.
 *
 * @param {string} title
 */
export const updateTitle =
  (title: string) => ({
    type: UPDATE_BOX_TITLE as typeof UPDATE_BOX_TITLE,
    payload: { title }
  });

const UPDATE_BOX_SUMMARY = 'UPDATE_BOX_SUMMARY';
/**
 * It updates the summary of the give box.
 *
 * @param {string} summary
 */
export const updateSummary =
  (summary: string) => ({
    type: UPDATE_BOX_SUMMARY as typeof UPDATE_BOX_SUMMARY,
    payload: { summary }
  });

const UPDATE_BOX_TAGS = 'UPDATE_BOX_TAGS';
/**
 * It updates tags(as a string) of the given box.
 *
 * @param {string} tags
 */
export const updateTags =
  (tags: string) => ({
    type: UPDATE_BOX_TAGS as typeof UPDATE_BOX_TAGS,
    payload: { tags }
  });

/**
 * Box action types.
 */
export const types = {
  UPDATE_BOX_TITLE,
  UPDATE_BOX_SUMMARY,
  UPDATE_BOX_TAGS,
};

/**
 * The data constructors of box actions
 */
export const actions = {
  updateTitle,
  updateSummary,
  updateTags,
};

export type Action = ActionUnion<typeof actions>;

/**
 * The action dispatcher for box actions.
 *
 * @param {BoxData} state The input box data.
 * @param {action} action A box action.
 */
export const reducer = (state: BoxData = emptyBoxData, action: Action = emptyAction): BoxData => {
  switch (action.type) {
    case UPDATE_BOX_TITLE: {
      const { title } = action.payload;

      return {
        ...state,
        title
      };
    }
    case UPDATE_BOX_SUMMARY: {
      const { summary } = action.payload;

      return {
        ...state,
        summary
      };
    }
    case UPDATE_BOX_TAGS: {
      const { tags } = action.payload;

      return {
        ...state,
        tags
      };
    }
    default: {
      return state;
    }
  }
};
