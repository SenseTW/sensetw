import { ObjectID } from './sense-object';
import { ActionUnion, emptyAction } from './index';
import { objectId, TimeStamp } from './utils';

// sense card data
export type CardID = string;

export enum CardType {
  NORMAL = 'NORMAL',
  QUESTION = 'QUESTION',
  ANSWER = 'ANSWER',
  NOTE = 'NOTE',
}

export const typeToString = (type: CardType) => {
  switch (type) {
    case CardType.NORMAL:
      return 'NORMAL';
    case CardType.QUESTION:
      return 'CARD';
    case CardType.ANSWER:
      return 'ANSWER';
    case CardType.NOTE:
      return 'NOTE';
    default:
      return 'UNKNOWN';
  }
};

export const stringToType: (name: string) => CardType =
  name => CardType[name];

export interface CardData {
  id: CardID;
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
}

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
  url: 'http://example.com',
  cardType: CardType.NORMAL
};

const now = +Date.now();
const sampleCardList: CardData[] = [{
  id: objectId(),
  createdAt: now,
  updatedAt: now,
  objects: {},
  title: '這是一張卡',
  summary: '這是卡片的內容',
  description: '',
  tags: '',
  saidBy: '',
  stakeholder: '',
  url: 'http://example.com',
  cardType: CardType.QUESTION
}, {
  id: objectId(),
  createdAt: now,
  updatedAt: now,
  objects: {},
  title: '這是另外一張卡',
  summary: '這是另外一張卡的內容',
  description: '',
  tags: '',
  saidBy: '',
  stakeholder: '',
  url: 'http://example.com',
  cardType: CardType.ANSWER
}, {
  id: objectId(),
  createdAt: now,
  updatedAt: now,
  objects: {},
  title: '這是一個 Note',
  summary: '這是 Note 的內容',
  description: '',
  tags: '',
  saidBy: '',
  stakeholder: '',
  url: 'http://example.com',
  cardType: CardType.NOTE
}];

const sampleCardMap = {};
sampleCardList.forEach((c) => { sampleCardMap[c.id] = c; });

// sense card actions
const UPDATE_CARD_TYPE = 'UPDATE_CARD_TYPE';
export const updateCardType =
  (cardType: CardType) => ({
    type: UPDATE_CARD_TYPE as typeof UPDATE_CARD_TYPE,
    payload: { cardType }
  });

const UPDATE_CARD_TITLE = 'UPDATE_CARD_TITLE';
export const updateTitle =
  (title: string) => ({
    type: UPDATE_CARD_TITLE as typeof UPDATE_CARD_TITLE,
    payload: { title }
  });

const UPDATE_CARD_SUMMARY = 'UPDATE_CARD_SUMMARY';
export const updateSummary =
  (summary: string) => ({
    type: UPDATE_CARD_SUMMARY as typeof UPDATE_CARD_SUMMARY,
    payload: { summary }
  });

const UPDATE_CARD_DESCRIPTION = 'UPDATE_CARD_DESCRIPTION';
export const updateDescription =
  (description: string) => ({
    type: UPDATE_CARD_DESCRIPTION as typeof UPDATE_CARD_DESCRIPTION,
    payload: { description }
  });

const UPDATE_CARD_TAGS = 'UPDATE_CARD_TAGS';
export const updateTags =
  (tags: string) => ({
    type: UPDATE_CARD_TAGS as typeof UPDATE_CARD_TAGS,
    payload: { tags }
  });

const UPDATE_CARD_SAID_BY = 'UPDATE_CARD_SAID_BY';
export const updateSaidBy =
  (saidBy: string) => ({
    type: UPDATE_CARD_SAID_BY as typeof UPDATE_CARD_SAID_BY,
    payload: { saidBy }
  });

const UPDATE_CARD_STAKEHOLDER = 'UPDATE_CARD_STAKEHOLDER';
export const updateStakeholder = (stakeholder: string) => ({
  type: UPDATE_CARD_STAKEHOLDER as typeof UPDATE_CARD_STAKEHOLDER,
  payload: { stakeholder }
});

const UPDATE_CARD_URL = 'UPDATE_CARD_URL';
export const updateUrl = (url: string) => ({
  type: UPDATE_CARD_URL as typeof UPDATE_CARD_URL,
  payload: { url }
});

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

export const reducer = (state: CardData, action: Action = emptyAction) => {
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

export const sampleStateCards: { [key: string]: CardData } = {
  '456': {
    id: '456',
    createdAt: 0,
    updatedAt: 0,
    title: '架構了一個網站寫好原始碼之後過來打分數',
      // tslint:disable-next-line:max-line-length
    summary: '泰美女總理盈拉，我曾與他共事過！我和世界不一樣，還是要勉強自己，或心動了你哼著，眼前的模樣關了燈，眼神越是發光我，ya，隨著你離去，闖入無人婚紗店，經過了冷言熱捧，好想你，顯露所有鋒芒對妳的付出妳永遠嫌不夠對妳的付出妳永遠嫌不夠把我們的心串在一起加熱抬頭，改變既有的模式！看似完美，架構了一個網站寫好原始碼之後',
    description: '',
    tags: '',
    saidBy: '同學一整學期沒有上過任何課',
    stakeholder: '汗水，這是怎麼回事',
    url: 'http://more.handlino.com/',
    cardType: CardType.NOTE,
    objects: { '123': { id: '123' } },
  },
  '459': {
    id: '459',
    createdAt: 0,
    updatedAt: 0,
    title: '像是長在大塊岩石底下的嫩草',
    // tslint:disable-next-line:max-line-length
    summary: '感謝上師，感謝上師，感謝上師，感謝上師，感謝上師，感謝上師，感謝上師，…被誰給偷走，卻又突然',
    description: '',
    tags: '',
    saidBy: '聯想控股董事長柳傳志',
    stakeholder: '感謝上師',
    url: 'http://more.handlino.com/',
    cardType: CardType.NORMAL,
    objects: { '126': { id: '126' } },
  },
  '458': {
    id: '458',
    createdAt: 0,
    updatedAt: 0,
    title: '那麼我為什麼要叫他們不要講話？',
    // tslint:disable-next-line:max-line-length
    summary: '在學期末之後，在學期末之後，老師好我是網頁設計課的同學，在學期末之後，但從頭到尾那些網頁也不是他自己寫的',
    description: '',
    tags: '',
    saidBy: '宏達電主打HTC，南投鹿神祭，全大運',
    stakeholder: '業者書讀得不多沒關係',
    url: 'http://more.handlino.com/',
    cardType: CardType.ANSWER,
    objects: { '125': { id: '125' } },
  },
  '457': {
    id: '457',
    createdAt: 0,
    updatedAt: 0,
    title: '現在我不敢肯定，我只要妳。',
    // tslint:disable-next-line:max-line-length
    summary: '《蘋果娛樂Online》線上直播，就讓我們繼續看下去...有想過女兒的心情嗎...老婆好大方...小編看傻眼惹。宏達電主打HTC，南投鹿神祭',
    description: '',
    tags: '',
    saidBy: '必須跟風險投資共擔風險',
    stakeholder: '做企業不是做俠客',
    url: 'http://more.handlino.com/',
    cardType: CardType.QUESTION,
    objects: { '124': { id: '124' } },
  },
};
