import * as SU from './sense-user';
import * as SA from './sense-article';
import { ActionUnion, emptyAction } from './index';
import { TimeStamp, objectId } from './utils';

// sense card data
export type CardID = string;
export type BoxID = string; // TODO: discuss

export enum CardType {
  Empty,
  Common,
  Box
}

export const typeToString = (type: CardType) => {
  switch (type) {
    case CardType.Common:
      return 'Card';
    case CardType.Box:
      return 'Box';
    case CardType.Empty:
    default:
      return 'Unknown';
  }
};

interface CoreCardData {
  id: CardID;
  title: string;
  description: string;
  color: string;
  created_by: SU.UserID;
  created_at: TimeStamp;
}

interface EmptyCardData extends CoreCardData {
  type: CardType.Empty;
}

export interface CommonCardData extends CoreCardData {
  type: CardType.Common;
  quote: string;
  said_by: SU.UserID;
  referred_to: SU.UserID;
  tags: string;
  parent: CardID | null;
  metadata: SA.Article;
}

export const splitTags = (str: string): string[] => str.split(/,\s*/);

export interface BoxCardData extends CoreCardData {
  type: CardType.Box;
  cards: CardID[];
}

export type CardData
  = EmptyCardData
  | CommonCardData
  | BoxCardData;

export const emptyCardData: EmptyCardData = {
  type: CardType.Empty,
  id: '0',
  title: '',
  description: '',
  color: '#f00',
  created_by: '0',
  created_at: 0
};

export const sampleCardList: CardData[] = [{
  id: objectId(),
  type: CardType.Common,
  title: '這是一張卡',
  description: '這是卡片的內容',
  color: '#f00',
  created_by: '0',
  created_at: 0,
  quote: '這是引言',
  said_by: '0',
  referred_to: '0',
  tags: '',
  parent: null,
  metadata: SA.emptyArticle
}, {
  id: objectId(),
  type: CardType.Common,
  title: '這是另外一張卡',
  description: '這是另外一張卡的內容',
  color: '#00f',
  created_by: '0',
  created_at: 0,
  quote: '這是另外一段引言',
  said_by: '0',
  referred_to: '0',
  tags: '',
  parent: null,
  metadata: SA.emptyArticle
}, {
  id: objectId(),
  type: CardType.Box,
  title: '這是一個 Box',
  description: '這是 Box 的內容',
  color: '#fff',
  created_by: '0',
  created_at: 0,
  cards: []
}];
const now = +Date.now();
let card;
card = sampleCardList[0] as CommonCardData;
card.created_by = SU.emptyUser.id;
card.created_at = now;
card.referred_to = SU.emptyUser.id;
card.said_by = SU.emptyUser.id;
card = sampleCardList[1] as CommonCardData;
card.created_by = SU.emptyUser.id;
card.created_at = now;
card.referred_to = SU.emptyUser.id;
card.said_by = SU.emptyUser.id;
card.parent = sampleCardList[2].id;
card = sampleCardList[2] as BoxCardData;
card.created_by = SU.emptyUser.id;
card.created_at = now;
card.cards = [sampleCardList[2].id];

export const sampleCardMap = {};
sampleCardList.forEach((c) => { sampleCardMap[c.id] = c; });

// sense card actions
const UPDATE_CARD_TITLE = 'UPDATE_CARD_TITLE';
export const updateTitle = (title: string) =>
  ({ type: UPDATE_CARD_TITLE as typeof UPDATE_CARD_TITLE, title });

const UPDATE_CARD_DESCRIPTION = 'UPDATE_CARD_DESCRIPTION';
export const updateDescription = (description: string) =>
  ({ type: UPDATE_CARD_DESCRIPTION as typeof UPDATE_CARD_DESCRIPTION, description });

const UPDATE_CARD_COLOR = 'UPDATE_CARD_COLOR';
export const updateColor = (color: string) =>
  ({ type: UPDATE_CARD_COLOR as typeof UPDATE_CARD_COLOR, color });

const UPDATE_CARD_QUOTE = 'UPDATE_CARD_QUOTE';
export const updateQuote = (quote: string) =>
  ({ type: UPDATE_CARD_QUOTE as typeof UPDATE_CARD_QUOTE, quote });

const UPDATE_CARD_TAGS = 'UPDATE_CARD_TAGS';
export const updateTags = (tags: string) =>
  ({ type: UPDATE_CARD_TAGS as typeof UPDATE_CARD_TAGS, tags });

export const actions = {
  updateTitle,
  updateDescription,
  updateColor,
  updateQuote,
  updateTags
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
    case UPDATE_CARD_COLOR: {
      const { color } = action;
      return { ...state, color };
    }
    case UPDATE_CARD_QUOTE: {
      if (state.type !== CardType.Common) {
        return state;
      }

      const { quote } = action;
      return { ...state, quote };
    }
    case UPDATE_CARD_TAGS: {
      if (state.type !== CardType.Common) {
        return state;
      }

      const { tags } = action;
      return { ...state, tags };
    }
    default:
      return state;
  }
};