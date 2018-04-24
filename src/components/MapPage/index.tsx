import * as React from 'react';
import { Container } from 'semantic-ui-react';
import Map from '../Map';
import { MapObject } from '../../types/sense-map';

const objects: MapObject[] = [
  {
    mapId: '000',
    id: '123',
    x: 10,
    y: 30,
    width: 100,
    height: 300,
    zIndex: 0,
    objectType: 'CARD',
    belongsTo: null,
    data: {
      id: '456',
      title: '架構了一個網站寫好原始碼之後過來打分數',
      // tslint:disable-next-line:max-line-length
      summary: '泰美女總理盈拉，我曾與他共事過！我和世界不一樣，還是要勉強自己，或心動了你哼著，眼前的模樣關了燈，眼神越是發光我，ya，隨著你離去，闖入無人婚紗店，經過了冷言熱捧，好想你，顯露所有鋒芒對妳的付出妳永遠嫌不夠對妳的付出妳永遠嫌不夠把我們的心串在一起加熱抬頭，改變既有的模式！看似完美，架構了一個網站寫好原始碼之後',
      saidBy: '同學一整學期沒有上過任何課',
      stakeholder: '汗水，這是怎麼回事',
      url: 'http://more.handlino.com/',
      cardType: 'NORMAL',
      belongsTo: null
    },
  },
  {
    mapId: '000',
    id: '124',
    x: 50,
    y: 100,
    width: 100,
    height: 300,
    zIndex: 0,
    objectType: 'CARD',
    belongsTo: null,
    data: {
      id: '457',
      title: '現在我不敢肯定，我只要妳。',
      // tslint:disable-next-line:max-line-length
      summary: '《蘋果娛樂Online》線上直播，就讓我們繼續看下去...有想過女兒的心情嗎...老婆好大方...小編看傻眼惹。宏達電主打HTC，南投鹿神祭',
      saidBy: '必須跟風險投資共擔風險',
      stakeholder: '做企業不是做俠客',
      url: 'http://more.handlino.com/',
      cardType: 'QUESTION',
      belongsTo: null
    },
  },
  {
    mapId: '000',
    id: '127',
    x: 350,
    y: 150,
    width: 100,
    height: 300,
    zIndex: 0,
    objectType: 'BOX',
    belongsTo: null,
    data: {
      id: '461',
      title: '安睡在天地的大房間',
      // tslint:disable-next-line:max-line-length
      summary: '將黑夜都遺忘在沙灘上光著我的腳丫在沙灘上光著我的腳丫姊姊你長得實在好漂亮對著每個人說撒哇低咖就這一次',
      contains: [
        {
          mapId: '000',
          id: '125',
          x: 250,
          y: 80,
          width: 100,
          height: 300,
          zIndex: 0,
          objectType: 'CARD',
          belongsTo: null,
          data: {
            id: '458',
            title: '那麼我為什麼要叫他們不要講話？',
            // tslint:disable-next-line:max-line-length
            summary: '在學期末之後，在學期末之後，老師好我是網頁設計課的同學，在學期末之後，但從頭到尾那些網頁也不是他自己寫的',
            saidBy: '宏達電主打HTC，南投鹿神祭，全大運',
            stakeholder: '業者書讀得不多沒關係',
            url: 'http://more.handlino.com/',
            cardType: 'ANSWER',
            belongsTo: null
          },
        },
        {
          mapId: '000',
          id: '126',
          x: 350,
          y: 150,
          width: 100,
          height: 300,
          zIndex: 0,
          objectType: 'CARD',
          belongsTo: null,
          data: {
            id: '459',
            title: '像是長在大塊岩石底下的嫩草',
            // tslint:disable-next-line:max-line-length
            summary: '感謝上師，感謝上師，感謝上師，感謝上師，感謝上師，感謝上師，感謝上師，…被誰給偷走，卻又突然',
            saidBy: '聯想控股董事長柳傳志',
            stakeholder: '感謝上師',
            url: 'http://more.handlino.com/',
            cardType: 'NOTE',
            belongsTo: null
          },
        },
      ]
    },
  },
];

class MapPage extends React.Component {
  render() {
    return (
      <Container text>
        <Map objects={objects} />
      </Container>
    );
  }
}

export default MapPage;
