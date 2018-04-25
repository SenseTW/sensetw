import { ObjectType, BaseObjectData, emptyObjectData } from './sense-object';
import { ActionUnion, emptyAction } from './index';
import { objectId } from './utils';

// sense card data
export type CardID = string;

export enum CardType {
  Normal,
  Question,
  Answer,
  Note
}

export const typeToString = (type: CardType) => {
  switch (type) {
    case CardType.Normal:
      return 'Normal';
    case CardType.Question:
      return 'Card';
    case CardType.Answer:
      return 'Answer';
    case CardType.Note:
      return 'Note';
    default:
      return 'Unknown';
  }
};

export interface CardData extends BaseObjectData {
  objectType: ObjectType.Card;
  card: CardID;
  saidBy: string;
  stakeholder: string;
  url: string;
  cardType: CardType;
}

export const emptyCardData: CardData = {
  ...emptyObjectData,
  objectType: ObjectType.Card,
  card: '0',
  saidBy: '',
  stakeholder: '',
  url: 'http://example.com',
  cardType: CardType.Normal
};

const now = +Date.now();
export const sampleCardList: CardData[] = [{
  ...emptyObjectData,
  objectType: ObjectType.Card,
  card: objectId(),
  createdAt: now,
  updatedAt: now,
  title: '這是一張卡',
  summary: '這是卡片的內容',
  saidBy: '',
  stakeholder: '',
  url: 'http://example.com',
  cardType: CardType.Question
}, {
  ...emptyObjectData,
  objectType: ObjectType.Card,
  card: objectId(),
  createdAt: now,
  updatedAt: now,
  title: '這是另外一張卡',
  summary: '這是另外一張卡的內容',
  saidBy: '',
  stakeholder: '',
  url: 'http://example.com',
  cardType: CardType.Answer
}, {
  ...emptyObjectData,
  objectType: ObjectType.Card,
  card: objectId(),
  createdAt: now,
  updatedAt: now,
  title: '這是一個 Note',
  summary: '這是 Note 的內容',
  saidBy: '',
  stakeholder: '',
  url: 'http://example.com',
  cardType: CardType.Note
}];

export const sampleCardMap = {};
sampleCardList.forEach((c) => { sampleCardMap[c.card] = c; });

// sense card actions
// TODO: should be UPDATE_OBJECT_TITLE
const UPDATE_CARD_TITLE = 'UPDATE_CARD_TITLE';
export const updateTitle = (title: string) =>
  ({ type: UPDATE_CARD_TITLE as typeof UPDATE_CARD_TITLE, title });

// TODO: should be UPDATE_OBJECT_SUMMARY
const UPDATE_CARD_SUMMARY = 'UPDATE_CARD_SUMMARY';
export const updateSummary = (summary: string) =>
  ({ type: UPDATE_CARD_SUMMARY as typeof UPDATE_CARD_SUMMARY, summary });

const UPDATE_CARD_SAID_BY = 'UPDATE_CARD_SAID_BY';
export const updateSaidBy = (saidBy: string) =>
  ({ type: UPDATE_CARD_SAID_BY as typeof UPDATE_CARD_SAID_BY, saidBy });

const UPDATE_CARD_STAKEHOLDER = 'UPDATE_CARD_STAKEHOLDER';
export const updateStakeholder = (stakeholder: string) =>
  ({ type: UPDATE_CARD_STAKEHOLDER as typeof UPDATE_CARD_STAKEHOLDER, stakeholder });

const UPDATE_CARD_COLOR = 'UPDATE_CARD_COLOR';
export const updateColor = (color: string) =>
  ({ type: UPDATE_CARD_COLOR as typeof UPDATE_CARD_COLOR, color });

export const actions = {
  updateTitle,
  updateSummary,
  updateColor,
  updateSaidBy,
  updateStakeholder
};

export type Action = ActionUnion<typeof actions>;

export const reducer = (state: CardData, action: Action = emptyAction) => {
  switch (action.type) {
    case UPDATE_CARD_TITLE: {
      const { title } = action;
      return { ...state, title };
    }
    case UPDATE_CARD_SUMMARY: {
      const { summary } = action;
      return { ...state, summary };
    }
    case UPDATE_CARD_SAID_BY: {
      const { saidBy } = action;
      return { ...state, saidBy };
    }
    case UPDATE_CARD_STAKEHOLDER: {
      const { stakeholder } = action;
      return { ...state, stakeholder };
    }
    case UPDATE_CARD_COLOR: {
      const { color } = action;
      return { ...state, color };
    }
    default:
      return state;
  }
};