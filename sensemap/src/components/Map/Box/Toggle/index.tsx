import * as React from 'react';
import { Group, Rect, Line } from 'react-konva';

interface Props {
  x: number;
  y: number;
  width: number;
  height: number;
  show: boolean;
  action: () => void;
}

const TriangleUp = (x: number, y: number) => (
  <Line
    points={[x + 5, y + 0, x + 10, y + 5, x + 0, y + 5]}
    closed={true}
    fill="#4a4a4a"
  />);

const TriangleDown = (x: number, y: number) => (
  <Line
    points={[x + 0, y + 0, x + 10, y + 0, x + 5, y + 5]}
    closed={true}
    fill="#4a4a4a"
  />);

class Toggle extends React.Component<Props> {

  static style = {
    height: 20,
    background: {
      color: '#f5f5f5',
    },
    border: {
      color: '#e5e5e5',
      width: 1,
    },
    cornerRadius: 4,
  };

  render() {
    const { x, y, width, height } = this.props;
    return (
      <Group x={x} y={y} onClick={this.props.action}>
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={Toggle.style.background.color}
          stroke={Toggle.style.border.color}
          strokeWidth={Toggle.style.border.width}
          cornerRadius={Toggle.style.cornerRadius}
        />
        {this.props.show
          ? TriangleUp(width / 2 - 5, 8.5)
          : TriangleDown(width / 2 - 5, 6.5)}
      </Group>
    );
  }
}

export default Toggle;
