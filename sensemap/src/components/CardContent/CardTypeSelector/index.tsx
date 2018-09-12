import * as React from 'react';
import TypeSelector from '../../TypeSelector';
import { CardType } from '../../../types';

interface Props {
  disabled?: boolean;
  cardType: CardType;
  onChange? (type: CardType): void;
}

const cardTypes = [
  CardType.NOTE,
  CardType.PROBLEM,
  CardType.SOLUTION,
  CardType.DEFINITION,
  CardType.INFO,
];

function CardTypeSelector(props: Props) {
  const { disabled, cardType, onChange } = props;

  return (
    <TypeSelector
      disabled={disabled}
      types={cardTypes}
      type={cardType}
      onChange={onChange}
    />
  );
}

export default CardTypeSelector;