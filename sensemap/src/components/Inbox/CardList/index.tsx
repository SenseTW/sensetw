import * as React from 'react';
import './index.css';
import Card from '../Card';
import * as T from '../../../types';

interface Props {
  cards: T.CardData[];
}

export default function CardList(props: Props) {
  const cards = props.cards;
  return (
    <div className="card-list">
      {cards.map((card, i) => <Card card={card} key={card.id} />)}
    </div>
  );
}
