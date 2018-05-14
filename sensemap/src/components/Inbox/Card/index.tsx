import * as React from 'react';
import './index.css';
import { Reveal } from 'semantic-ui-react';
import CardAction from '../CardActions';

interface Props {
}

export default function Card(props: Props) {
  return (
    <div className="card">
      <Reveal animated="fade">
        <Reveal.Content hidden>
          <CardAction />
        </Reveal.Content>
        <Reveal.Content visible>
          <div className="card__body">
            <div className="card__summary">
              站在漆黑的床邊，與他同年齡的影子。解郁。美國牛肉沒有任何的問題，天哪，請收拾好
            </div>
            <div className="card__tag-panel">
              <div className="card__tag">
                驚爆新歡
              </div>
              <div className="card__tag">
                感謝上師
              </div>
            </div>
          </div>
        </Reveal.Content>
      </Reveal>
    </div>
  );
}
