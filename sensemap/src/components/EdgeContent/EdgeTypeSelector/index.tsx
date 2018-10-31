import * as React from 'react';
import TypeSelector from '../../TypeSelector';
import { Props as IconProps } from '../../SVGIcon';
import EdgeTypeNone from '../../SVGIcon/EdgeTypeNone';
import EdgeTypeDirected from '../../SVGIcon/EdgeTypeDirected';
import EdgeTypeReversed from '../../SVGIcon/EdgeTypeReversed';
import EdgeTypeBidirected from '../../SVGIcon/EdgeTypeBidirected';
import { EdgeType } from '../../../types';
import './index.css';

interface WrapProps {
  className?: string;
  children?: React.ReactChildren;
}

const withIcon = (Icon: React.ComponentType<IconProps>) => (props: WrapProps) => {
  return (
    <div {...props}>
      {props.children}
      <Icon />
    </div>
  );
};

interface Props {
  id?: string;
  disabled?: boolean;
  typePrefix?: string;
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

const typeAs = {
  [EdgeType.NONE]: withIcon(EdgeTypeNone),
  [EdgeType.DIRECTED]: withIcon(EdgeTypeDirected),
  [EdgeType.REVERSED]: withIcon(EdgeTypeReversed),
  [EdgeType.BIDIRECTED]: withIcon(EdgeTypeBidirected),
};

function EdgeTypeSelector(props: Props) {
  const { id, disabled, typePrefix, edgeType, onChange } = props;

  return (
    <TypeSelector
      id={id}
      className="edge-type-selector"
      disabled={disabled}
      typePrefix={typePrefix}
      types={edgeTypes}
      typeNames={typeNames}
      eachAs={typeAs}
      type={edgeType}
      onChange={onChange}
    />
  );
}

export default EdgeTypeSelector;