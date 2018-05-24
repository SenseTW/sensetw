import * as React from 'react';
import './index.css';
import * as T from '../../../types';
import { Reveal } from 'semantic-ui-react';
import Dragged from '../../Dragged';
import CardAction from '../CardActions';

interface Props {
  card: T.CardData;
  dragged?: Boolean;
  summaryLimit?: number;
}

function renderCardTags({ tags }: { tags: string }) {
  const eachTag = tags.split(',').filter(t => t.length > 0);
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

function isInMap(card: T.CardData): Boolean {
  return Object.keys(card.objects).length > 0;
}

function classNames({ card, dragged = false }: Props): string {
  return [
    'card',
    isInMap(card)
      ? 'card--in-map'
      : (!dragged ? 'card--not-in-map' : 'card--dragged'),
    `card--${(card.cardType as string).toLowerCase()}`,
  ].join(' ');
}

export default function Card(props: Props) {
  const { dragged = false, summaryLimit = 39 } = props;
  const card = {
    ...props.card,
    summary: props.card.summary.substr(0, summaryLimit),
  };

  if (dragged) {
    return (
      <Dragged>
        <div className={classNames(props)}>
          <div className="card__body">
            <div className="card__summary">
              {card.summary}
            </div>
            {renderCardTags({ tags: card.tags })}
          </div>
        </div>
      </Dragged>
    );
  } else {
    return (
      <div className={classNames(props)}>
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
              {renderCardTags({ tags: card.tags })}
            </div>
          </Reveal.Content>
        </Reveal>
      </div>
    );
  }
}
