import * as React from 'react';
import { Group, Line } from 'react-konva';
import { TransformerForProps } from '../../Layout';
import Selectable from '../../Layout/Selectable';
import * as G from '../../../graphics/point';
import { Edge as EdgeData } from '../../../types';
import { noop } from '../../../types/utils';

export interface Props extends TransformerForProps {
  from:      G.Point;
  to:        G.Point;
  data:      EdgeData;
  isDirty?:  boolean;
  selected?: boolean;
  // tslint:disable:no-any
  onSelect?(e: any, edge: EdgeData): void;
  onDeselect?(e: any, edge: EdgeData): void;
  onMouseOver?(e: any, edge: EdgeData): void;
  onMouseOut?(e: any, edge: EdgeData): void;
  onOpen?(e: any, edge: EdgeData): void;
  // tslint:enable
}

class Edge extends React.PureComponent<Props> {
  static style = {
    color: '#000000',
    touchWidth: 24,
    hover: {
      color: '#0277bd',
    },
    selected: {
      color: '#3ad8fa',
    },
  };

  render () {
    const { transform, data, selected } = this.props;
    const style = Edge.style;
    const from = G.toTuple(transform(this.props.from));
    const to = G.toTuple(transform(this.props.to));
    const onSelect    = this.props.onSelect    || noop;
    const onDeselect  = this.props.onDeselect  || noop;
    const onMouseOver = this.props.onMouseOver || noop;
    const onMouseOut  = this.props.onMouseOut  || noop;
    const onOpen      = this.props.onOpen      || noop;

    return (
      <Selectable
        selected={selected}
        onSelect={(e) => {
          e.cancelBubble = true;
          onSelect(e, data);
        }}
        onDeselect={(e) => {
          e.cancelBubble = true;
          onDeselect(e, data);
        }}
      >
        <Group>
          <Line
            points={[...from, ...to]}
            stroke={selected ? style.selected.color : style.color}
          />
          <Line
            points={[...from, ...to]}
            stroke="transparent"
            strokeWidth={style.touchWidth}
            onDblClick={(e) => {
              onSelect(e, data);
              onOpen(e, data);
            }}
            onMouseOver={(e) => onMouseOver(e, data)}
            onMouseOut={(e) => onMouseOut(e, data)}
          />
        </Group>
      </Selectable>
    );
  }
}

export default Edge;
