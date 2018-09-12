import * as React from 'react';
import TypeSelector from '../../TypeSelector';
import { BoxType } from '../../../types';

interface Props {
  disabled?: boolean;
  boxType: BoxType;
  onChange? (type: BoxType): void;
}

const cardTypes = [
  BoxType.NOTE,
  BoxType.PROBLEM,
  BoxType.SOLUTION,
  BoxType.DEFINITION,
  BoxType.INFO,
];

function BoxTypeSelector(props: Props) {
  const { disabled, boxType, onChange } = props;

  return (
    <TypeSelector
      disabled={disabled}
      types={cardTypes}
      type={boxType}
      onChange={onChange}
    />
  );
}

export default BoxTypeSelector;