import { HasID } from './has-id';
import { ObjectID } from './object';
import { UserData, anonymousUserData } from './user';
import { ActionUnion, emptyAction } from '../action';
import { TimeStamp } from '../utils';
import { equals } from 'ramda';
import * as moment from 'moment';

export type CardID = string;

export enum CardType {
  NORMAL = 'NORMAL',
  QUESTION = 'QUESTION',
  ANSWER = 'ANSWER',
  NOTE = 'NOTE',
  PROBLEM = 'PROBLEM',
  SOLUTION = 'SOLUTION',
  DEFINITION = 'DEFINITION',
  INFO = 'INFO',
}

/**
 * The default width of a card on a sense map.
 *
 * @todo Move it to the sense map file.
 */
export const DEFAULT_WIDTH  = 240;
/**
 * The default height of a card on a sense map.
 *
 * @todo Move it to the sense map file.
 */
export const DEFAULT_HEIGHT = 160;

export const typeToString = (type: CardType) => {
  switch (type) {
    case CardType.NORMAL:
    case CardType.QUESTION:
    case CardType.ANSWER:
    case CardType.NOTE:
    case CardType.DEFINITION:
    case CardType.PROBLEM:
    case CardType.SOLUTION:
      return type as string;
    default:
      return 'UNKNOWN';
  }
};

export const stringToType: (name: string) => CardType =
  name => CardType[name];

/**
 * It describes a card.
 *
 * @extends {HasID<CardID>}
 */
export interface CardData extends HasID<CardID> {
  createdAt: TimeStamp;
  updatedAt: TimeStamp;
  objects: { [key: string]: { id: ObjectID } };
  title: string;
  summary: string;
  description: string;
  tags: string;
  saidBy: string;
  stakeholder: string;
  url: string;
  cardType: CardType;
  owner: UserData;
}

/**
 * The partial card data.
 */
interface PartialCardData {
  id?: CardID;
  createdAt?: TimeStamp;
  updatedAt?: TimeStamp;
  title?: string;
  summary?: string;
  description?: string;
  tags?: string;
  saidBy?: string;
  stakeholder?: string;
  url?: string;
  cardType?: CardType;
}

/**
 * An empty card. The null value of the `CardData`.
 *
 * @todo Add an `isEmpty` function if we want to serialize/deserialize them.
 */
export const emptyCardData: CardData = {
  id: '0',
  createdAt: 0,
  updatedAt: 0,
  objects: {},
  title: '',
  summary: '',
  description: '',
  tags: '',
  saidBy: '',
  stakeholder: '',
  url: '',
  cardType: CardType.NORMAL,
  owner: anonymousUserData,
};

/**
 * It creates a card from a partial card data at the current moment.
 *
 * @param {PartialCardData} partial The partial card data. It defaults to an
 * empty object.
 */
export const cardData = (partial: PartialCardData = {}): CardData => {
  const now = +moment();

  return {
    ...{...emptyCardData, summary: 'New Card' },
    ...partial,
    createdAt: now,
    updatedAt: now,
  };
};

export const isEmpty = (card: CardData): boolean => equals(emptyCardData, card);

const UPDATE_CARD_TYPE = 'UPDATE_CARD_TYPE';
/**
 * It updates the card type.
 *
 * @param {CardType} cardType
 */
export const updateCardType =
  (cardType: CardType) => ({
    type: UPDATE_CARD_TYPE as typeof UPDATE_CARD_TYPE,
    payload: { cardType }
  });

const UPDATE_CARD_TITLE = 'UPDATE_CARD_TITLE';
/**
 * A message to update the card title.
 *
 * @param {string} title
 */
export const updateTitle =
  (title: string) => ({
    type: UPDATE_CARD_TITLE as typeof UPDATE_CARD_TITLE,
    payload: { title }
  });

const UPDATE_CARD_SUMMARY = 'UPDATE_CARD_SUMMARY';
/**
 * A message to update the card summary.
 *
 * @param {string} summary
 */
export const updateSummary =
  (summary: string) => ({
    type: UPDATE_CARD_SUMMARY as typeof UPDATE_CARD_SUMMARY,
    payload: { summary }
  });

const UPDATE_CARD_DESCRIPTION = 'UPDATE_CARD_DESCRIPTION';
/**
 * A message to update the card description.
 *
 * @param {string} description
 */
export const updateDescription =
  (description: string) => ({
    type: UPDATE_CARD_DESCRIPTION as typeof UPDATE_CARD_DESCRIPTION,
    payload: { description }
  });

const UPDATE_CARD_TAGS = 'UPDATE_CARD_TAGS';
/**
 * A message to update card tags(as a string).
 * @param {string} tags
 */
export const updateTags =
  (tags: string) => ({
    type: UPDATE_CARD_TAGS as typeof UPDATE_CARD_TAGS,
    payload: { tags }
  });

const UPDATE_CARD_SAID_BY = 'UPDATE_CARD_SAID_BY';
/**
 * A message to update the source(a person) of the card.
 *
 * @param {string} saidBy
 */
export const updateSaidBy =
  (saidBy: string) => ({
    type: UPDATE_CARD_SAID_BY as typeof UPDATE_CARD_SAID_BY,
    payload: { saidBy }
  });

const UPDATE_CARD_STAKEHOLDER = 'UPDATE_CARD_STAKEHOLDER';
/**
 * A message to update the interested party/stakeholder of the card.
 *
 * @param {string} stakeholder
 */
export const updateStakeholder =
  (stakeholder: string) => ({
    type: UPDATE_CARD_STAKEHOLDER as typeof UPDATE_CARD_STAKEHOLDER,
    payload: { stakeholder }
  });

const UPDATE_CARD_URL = 'UPDATE_CARD_URL';
/**
 * A message to update the card URL.
 *
 * @param {string} url
 */
export const updateUrl =
  (url: string) => ({
    type: UPDATE_CARD_URL as typeof UPDATE_CARD_URL,
    payload: { url }
  });

/**
 * The data constructors of card actions.
 */
export const actions = {
  updateCardType,
  updateTitle,
  updateSummary,
  updateDescription,
  updateTags,
  updateSaidBy,
  updateStakeholder,
  updateUrl
};

export type Action = ActionUnion<typeof actions>;

/**
 * The action dispatcher of card actions.
 *
 * @param {CardData} state The input card data.
 * @param {Action} action A card action.
 */
export const reducer = (state: CardData = emptyCardData, action: Action = emptyAction): CardData => {
  switch (action.type) {
    case UPDATE_CARD_TYPE: {
      const { cardType } = action.payload;
      return { ...state, cardType };
    }
    case UPDATE_CARD_TITLE: {
      const { title } = action.payload;
      return { ...state, title };
    }
    case UPDATE_CARD_SUMMARY: {
      const { summary } = action.payload;
      return { ...state, summary };
    }
    case UPDATE_CARD_DESCRIPTION: {
      const { description } = action.payload;
      return { ...state, description };
    }
    case UPDATE_CARD_TAGS: {
      const { tags } = action.payload;
      return { ...state, tags };
    }
    case UPDATE_CARD_SAID_BY: {
      const { saidBy } = action.payload;
      return { ...state, saidBy };
    }
    case UPDATE_CARD_STAKEHOLDER: {
      const { stakeholder } = action.payload;
      return { ...state, stakeholder };
    }
    case UPDATE_CARD_URL: {
      const { url } = action.payload;
      return { ...state, url };
    }
    default:
      return state;
  }
};
