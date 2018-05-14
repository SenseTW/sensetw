import * as React from 'react';
import Card from '../Card';
import './index.css';

interface Props {
}

export default function CardList(props: Props) {
  return (
    <div className="card-list">
      {Array(16).fill(0).map((_, i) => <Card key={i}/>)}
    </div>
  );
}
