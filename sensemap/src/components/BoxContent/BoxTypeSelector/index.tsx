import * as React from 'react';
import TypeSelector from '../../TypeSelector';
import { BoxType } from '../../../types';

interface Props {
  id?: string;
  disabled?: boolean;
  typePrefix?: string;
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
  const { id, disabled, typePrefix, boxType, onChange } = props;

  return (
    <TypeSelector
      id={id}
      disabled={disabled}
      typePrefix={typePrefix}
      types={cardTypes}
      type={boxType}
      onChange={onChange}
    />
  );
}

export default BoxTypeSelector;