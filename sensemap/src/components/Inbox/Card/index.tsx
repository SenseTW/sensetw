import * as React from 'react';
import './index.css';
import * as T from '../../../types';
import { Reveal } from 'semantic-ui-react';
import CardAction from '../CardActions';

const summaryLimit = 39;

interface Props {
  card: T.CardData;
}

function renderCardTags({ tags }: { tags: string }) {
  const eachTag = tags.split(',');
  return (
    <div className="card__tag-panel">
      {eachTag.map(tagName => (
        <div className="card__tag">
          {tagName}
        </div>
      ))}
    </div>
  );
}

export default function Card(props: Props) {
  const card = {
    ...props.card,
    summary: props.card.summary.substr(0, summaryLimit),
  };
  const className = [
    'card',
    (Object.keys(card.objects).length > 0 ? 'card--in-map' : 'card--not-in-map'),
    `card--${(card.cardType as string).toLowerCase()}`,
    (Math.random() > 0.5 ? `card--focused` : ''),
  ].join(' ');
  return (
    <div className={className}>
      <Reveal animated="fade">
        <Reveal.Content hidden>
          <CardAction card={card} />
        </Reveal.Content>
        /* XXX a hack */
        <Reveal.Content visible style={{ pointerEvents: 'none' }}>
          <div className="card__body">
            <div className="card__summary">
              {card.summary}
            </div>
            {renderCardTags({ tags: '驚爆新歡,感謝上師' })}
          </div>
        </Reveal.Content>
      </Reveal>
    </div>
  );
}
