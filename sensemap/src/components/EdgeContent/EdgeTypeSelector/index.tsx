import * as React from 'react';
import TypeSelector from '../../TypeSelector';
import { EdgeType } from '../../../types';
import './index.css';

interface Props {
  disabled?: boolean;
  edgeType: EdgeType;
  onChange? (type: EdgeType): void;
}

const edgeTypes = [
  EdgeType.NONE,
  EdgeType.DIRECTED,
  EdgeType.REVERSED,
  EdgeType.BIDIRECTED,
];

const typeNames = {
  [EdgeType.NONE]: 'none',
  [EdgeType.DIRECTED]: 'arrow',
  [EdgeType.REVERSED]: 'reverse',
  [EdgeType.BIDIRECTED]: 'double',
};

function EdgeTypeSelector(props: Props) {
  const { disabled, edgeType, onChange } = props;

  return (
    <TypeSelector
      className="edge-type-selector"
      disabled={disabled}
      types={edgeTypes}
      typeNames={typeNames}
      type={edgeType}
      onChange={onChange}
    />
  );
}

export default EdgeTypeSelector;