import { ObjectID } from './sense-object';
import { ActionUnion, emptyAction } from './index';
import { TimeStamp, Color, objectId } from './utils';

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

export interface CardData {
  id: CardID;
  createdAt: TimeStamp;
  updatedAt: TimeStamp;
  title: string;
  description: string;
  saidBy: string;
  stakeholder: string;
  url: URL;
  color: Color;
  cardType: CardType;
  objects?: ObjectID[];
}

export const emptyCardData: CardData = {
  id: '0',
  createdAt: 0,
  updatedAt: 0,
  title: '',
  description: '',
  saidBy: '',
  stakeholder: '',
  url: new URL('http://example.com'),
  color: '#fff',
  cardType: CardType.Normal
};

const now = +Date.now();
export const sampleCardList: CardData[] = [{
  id: objectId(),
  createdAt: now,
  updatedAt: now,
  title: '這是一張卡',
  description: '這是卡片的內容',
  saidBy: '',
  stakeholder: '',
  url: new URL('http://example.com'),
  color: '#f00',
  cardType: CardType.Question
}, {
  id: objectId(),
  createdAt: now,
  updatedAt: now,
  title: '這是另外一張卡',
  description: '這是另外一張卡的內容',
  saidBy: '',
  stakeholder: '',
  url: new URL('http://example.com'),
  color: '#00f',
  cardType: CardType.Answer
}, {
  id: objectId(),
  createdAt: now,
  updatedAt: now,
  title: '這是一個 Note',
  description: '這是 Note 的內容',
  saidBy: '',
  stakeholder: '',
  url: new URL('http://example.com'),
  color: '#fff',
  cardType: CardType.Note
}];

export const sampleCardMap = {};
sampleCardList.forEach((c) => { sampleCardMap[c.id] = c; });

// sense card actions
const UPDATE_CARD_TITLE = 'UPDATE_CARD_TITLE';
export const updateTitle = (title: string) =>
  ({ type: UPDATE_CARD_TITLE as typeof UPDATE_CARD_TITLE, title });

const UPDATE_CARD_DESCRIPTION = 'UPDATE_CARD_DESCRIPTION';
export const updateDescription = (description: string) =>
  ({ type: UPDATE_CARD_DESCRIPTION as typeof UPDATE_CARD_DESCRIPTION, description });

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
  updateDescription,
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
    case UPDATE_CARD_DESCRIPTION: {
      const { description } = action;
      return { ...state, description };
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