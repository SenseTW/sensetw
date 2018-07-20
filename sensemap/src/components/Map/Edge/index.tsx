import * as React from 'react';
import { Line } from 'react-konva';
import * as D from '../../../graphics/drawing';
import * as G from '../../../graphics/point';

export interface Props {
  from:             D.BoundingBox;
  to:               D.BoundingBox;
  transform:        G.Transform;
  inverseTransform: G.Transform;
}

export function Edge(props: Props) {
  const from = G.toTuple(props.transform(props.from));
  const to = G.toTuple(props.transform(props.to));
  return (
    <Line points={[...from, ...to]} stroke="black" />
  );
}

export default Edge;
