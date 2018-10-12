import * as React from 'react';
import { Line } from 'react-konva';
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

export function Edge(props: Props) {
  const from = G.toTuple(props.transform(props.from));
  const to = G.toTuple(props.transform(props.to));
  const data        = props.data;
  const selected    = !!props.selected;
  const onSelect    = props.onSelect    || noop;
  const onDeselect  = props.onDeselect  || noop;
  const onMouseOver = props.onMouseOver || noop;
  const onMouseOut  = props.onMouseOut  || noop;
  const onOpen      = props.onOpen      || noop;

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
      <Line
        points={[...from, ...to]}
        stroke="black"
        onDblClick={(e) => {
          onSelect(e, data);
          onOpen(e, data);
        }}
        onMouseOver={(e) => onMouseOver(e, data)}
        onMouseOut={(e) => onMouseOut(e, data)}
      />
    </Selectable>
  );
}

export default Edge;
