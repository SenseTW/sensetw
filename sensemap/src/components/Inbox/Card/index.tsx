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
  const eachTag = tags.split(',').filter(t => t.length > 0);
  return (
    <div className="card__tag-panel">
      {eachTag.map((tagName, i) => (
        <div className="card__tag" key={i}>
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
    'inbox-card',
    (Object.keys(card.objects).length > 0 ? 'card--in-map' : 'card--not-in-map'),
    `card--${(card.cardType as string).toLowerCase()}`,
  ].join(' ');
  return (
    <div className={className}>
      <Reveal animated="fade">
        <Reveal.Content hidden>
          <CardAction card={card} />
        </Reveal.Content>
        {/* XXX a hack */}
        <Reveal.Content visible style={{ pointerEvents: 'none' }}>
          <div className="card__body">
            <div className="card__summary">
              {card.summary} <br />
            </div>
            {renderCardTags({ tags: card.tags })}
          </div>
        </Reveal.Content>
      </Reveal>
    </div>
  );
}
