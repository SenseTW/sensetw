import * as React from 'react';
import TypeSelector from '../../TypeSelector';
import { CardType } from '../../../types';

interface Props {
  id?: string;
  disabled?: boolean;
  typePrefix?: string;
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
  const { id, disabled, typePrefix, cardType, onChange } = props;

  return (
    <TypeSelector
      id={id}
      disabled={disabled}
      typePrefix={typePrefix}
      types={cardTypes}
      type={cardType}
      onChange={onChange}
    />
  );
}

export default CardTypeSelector;