import * as React from 'react';
import { Line } from 'react-konva';
import { TransformerForProps } from '../../Layout';
import { Point, toTuple } from '../../../graphics/point';
import { transformObject } from '../../../types/viewport';

interface OwnProps {
  from: Point;
  to: Point;
}

type Props = OwnProps & TransformerForProps;

class Edge extends React.PureComponent<Props> {
  static style = {
    color: 'black',
  };

  render() {
    const { transform } = this.props;
    const from = toTuple(transform(this.props.from));
    const to = toTuple(transform(this.props.to));
    const style = transformObject(transform, Edge.style) as typeof Edge.style;

    return (
      <Line points={[...from, ...to]} stroke={style.color} />
    );
  }
}

export default Edge;