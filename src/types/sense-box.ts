import { ObjectID } from './sense-object';
import { TimeStamp } from './utils';

export type BoxID = string;

export interface BoxData {
  id: BoxID;
  createdAt: TimeStamp;
  updatedAt: TimeStamp;
  objects: { [key: string]: ObjectID };
  title: string;
  summary: string;
  contains: { [key: string]: ObjectID };
}

export const sampleStateBoxes: { [key: string]: BoxData } = {
  '461': {
    id: '461',
    createdAt: 0,
    updatedAt: 0,
    title: '安睡在天地',
    // tslint:disable-next-line:max-line-length
    summary: '將黑夜都遺忘在沙灘上光著我的腳丫在沙灘上光著我的腳丫姊姊你長得實在好漂亮對著每個人說撒哇低咖就這一次',
    objects: { '127': '127' },
    contains: {},
  },
  '462': {
    id: '462',
    createdAt: 0,
    updatedAt: 0,
    title: '我心裏卻并不快爽',
    // tslint:disable-next-line:max-line-length
    summary: '不在乎我的過往，安睡在天地的大房間。',
    contains: {},
    objects: { '137': '137' },
  },
};
