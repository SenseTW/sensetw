import * as React from 'react';
import { Group, Line, Circle } from 'react-konva';
import { TransformerForProps } from '../../Layout';
import Selectable from '../../Layout/Selectable';
import * as G from '../../../graphics/point';
import { EdgeType, Edge as EdgeData } from '../../../types';
import { SQRT3, noop } from '../../../types/utils';

export interface Props extends TransformerForProps {
  from:      G.Point;
  to:        G.Point;
  data:      EdgeData;
  isDirty?:  boolean;
  selected?: boolean;
  hovered?:  boolean;
  // tslint:disable:no-any
  onSelect?(e: any, edge: EdgeData): void;
  onDeselect?(e: any, edge: EdgeData): void;
  onMouseOver?(e: any, edge: EdgeData): void;
  onMouseMove?(e: any, edge: EdgeData): void;
  onMouseOut?(e: any, edge: EdgeData): void;
  onOpen?(e: any, edge: EdgeData): void;
  // tslint:enable
}

interface IndicatorProps {
  edgeType: EdgeType;
  x: number;
  y: number;
  radius: number;
  rotation: number;
  color: string;
  backgroundColor: string;
}

function Indicator(props: IndicatorProps) {
  const {
    edgeType,
    radius,
    rotation,
    x,
    y,
    color,
    backgroundColor
  } = props;
  const innerRadius = radius * 0.7;

  const circle = <Circle radius={radius} fill={backgroundColor} />;
  let icon;
  switch (edgeType) {
    case EdgeType.DIRECTED: {
      icon = (
        <>
          {circle}
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
        </>
      );
      break;
    }
    case EdgeType.REVERSED: {
      icon = (
        <>
          {circle}
          <Line
            closed
            points={[
              innerRadius / 2, -innerRadius / 2 * SQRT3,
              -innerRadius, 0,
              innerRadius / 2, innerRadius / 2 * SQRT3,
            ]}
            rotation={rotation}
            fill={color}
          />
        </>
      );
      break;
    }
    case EdgeType.BIDIRECTED: {
      icon = (
        <>
          {circle}
          <Line
            closed
            points={[
              innerRadius / 4, -innerRadius / 3 * SQRT3,
              innerRadius, 0,
              innerRadius / 4, innerRadius / 3 * SQRT3,
            ]}
            rotation={rotation}
            fill={color}
          />
          <Line
            closed
            points={[
              -innerRadius / 4, -innerRadius / 3 * SQRT3,
              -innerRadius, 0,
              -innerRadius / 4, innerRadius / 3 * SQRT3,
            ]}
            rotation={rotation}
            fill={color}
          />
        </>
      );
      break;
    }
    case EdgeType.NONE:
    default:
  }

  return <Group x={x} y={y}>{icon}</Group>;
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
    }
  };

  render () {
    const { transform, data, selected, hovered } = this.props;
    const style = Edge.style;
    const color =
      selected
        ? style.selected.color
        : hovered
            ? style.hover.color
            : style.color;
    const from = G.toTuple(transform(this.props.from));
    const to = G.toTuple(transform(this.props.to));
    const dX = (to[0] - from[0]);
    const dY = (to[1] - from[1]);
    const points = [
      {
        x: from[0] + dX / 3,
        y: from[1] + dY / 3,
        edgeType: data.edgeType === EdgeType.BIDIRECTED
          ? EdgeType.REVERSED
          : data.edgeType
      },
      {
        x: from[0] + dX / 2,
        y: from[1] + dY / 2,
        edgeType: data.edgeType === EdgeType.BIDIRECTED
          ? EdgeType.BIDIRECTED
          : data.edgeType
      },
      {
        x: from[0] + dX / 3 * 2,
        y: from[1] + dY / 3 * 2,
        edgeType: data.edgeType === EdgeType.BIDIRECTED
          ? EdgeType.DIRECTED
          : data.edgeType
      },
    ];
    const rotation = Math.atan2(dY, dX) * 180 / Math.PI;
    const onSelect    = this.props.onSelect    || noop;
    const onDeselect  = this.props.onDeselect  || noop;
    const onMouseOver = this.props.onMouseOver || noop;
    const onMouseMove = this.props.onMouseMove || noop;
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
            stroke={color}
          />
          {
            points.map((p, i) =>
              <Indicator
                key={i}
                edgeType={p.edgeType}
                x={p.x}
                y={p.y}
                radius={style.indicator.radius}
                rotation={rotation}
                color={style.indicator.color}
                backgroundColor={color}
              />
            )
          }
          <Line
            points={[...from, ...to]}
            stroke="transparent"
            strokeWidth={style.touchWidth}
            onDblClick={(e) => {
              onSelect(e, data);
              onOpen(e, data);
            }}
            onMouseOver={(e) => onMouseOver(e, data)}
            onMouseMove={(e) => onMouseMove(e, data)}
            onMouseOut={(e) => onMouseOut(e, data)}
          />
        </Group>
      </Selectable>
    );
  }
}

export default Edge;
