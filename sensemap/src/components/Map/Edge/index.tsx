import * as React from 'react';
import { Group, Line, Circle } from 'react-konva';
import { TransformerForProps } from '../../Layout';
import Selectable from '../../Layout/Selectable';
import * as G from '../../../graphics/point';
import { Edge as EdgeData } from '../../../types';
import { transformObject } from '../../../types/viewport';
import { noop } from '../../../types/utils';

const SQRT3 = 1.73205;

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

interface IndicatorProps {
  x: number;
  y: number;
  radius: number;
  rotation: number;
  color: string;
  backgroundColor: string;
}

function Indicator(props: IndicatorProps) {
  const { radius, rotation, x, y, color, backgroundColor } = props;
  const innerRadius = radius * 0.75;

  return (
    <Group x={x} y={y}>
      <Circle
        radius={radius}
        fill={backgroundColor}
      />
      <Line
        closed
        points={[
          -innerRadius / 2, -innerRadius / 2 * SQRT3,
          innerRadius, 0,
          -innerRadius / 2, innerRadius / 2 * SQRT3,
        ]}
        rotation={rotation}
        fill={color}
      />
    </Group>
  );
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
    indicator: {
      radius: 6,
      color: '#ffffff',
      distance: 100,
    }
  };

  render () {
    const { transform, data, selected } = this.props;
    const style = transformObject(transform, Edge.style) as typeof Edge.style;
    const from = G.toTuple(transform(this.props.from));
    const to = G.toTuple(transform(this.props.to));
    const centerX = (from[0] + to[0]) / 2;
    const centerY = (from[1] + to[1]) / 2;
    const dX = (to[0] - from[0]);
    const dY = (to[1] - from[1]);
    const showMoreIndicators = dX * dX + dY * dY > 4 * style.indicator.distance * style.indicator.distance;
    const radius = Math.atan2(dY, dX);
    const rotation = radius * 180 / Math.PI;
    const x100 = Math.cos(radius) * style.indicator.distance;
    const y100 = Math.sin(radius) * style.indicator.distance;
    const prevX = centerX - x100;
    const prevY = centerY - y100;
    const nextX = centerX + x100;
    const nextY = centerY + y100;
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
          {
            showMoreIndicators &&
            <Indicator
              x={prevX}
              y={prevY}
              radius={style.indicator.radius}
              rotation={rotation}
              color={style.indicator.color}
              backgroundColor={selected ? style.selected.color : style.color}
            />
          }
          <Indicator
            x={centerX}
            y={centerY}
            radius={style.indicator.radius}
            rotation={rotation}
            color={style.indicator.color}
            backgroundColor={selected ? style.selected.color : style.color}
          />
          {
            showMoreIndicators &&
            <Indicator
              x={nextX}
              y={nextY}
              radius={style.indicator.radius}
              rotation={rotation}
              color={style.indicator.color}
              backgroundColor={selected ? style.selected.color : style.color}
            />
          }
        </Group>
      </Selectable>
    );
  }
}

export default Edge;
