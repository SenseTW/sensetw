import * as React from 'react';
import * as T from '../../../types';
import { Line } from 'react-konva';

export interface Props {
  from: T.ObjectData;
  to:   T.ObjectData;
}

export function Edge(props: Props) {
  return (
    <Line points={[300, 100, 500, 700]} stroke="black" />
  );
}

export default Edge;
