import * as SU from './sense-user';
import * as SA from './sense-article';
import { TimeStamp, objectId } from './utils';

export type CardID = string;
export type BoxID = string; // TODO: discuss

export enum CardType {
  Empty,
  Common,
  Box
}

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

interface CommonCardData extends CoreCardData {
  type: CardType.Common;
  quote: string;
  said_by: SU.UserID;
  referred_to: SU.UserID;
  tags: string;
  parent: CardID | null;
  metadata: SA.Article;
}

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