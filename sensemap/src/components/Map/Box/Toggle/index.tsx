import * as React from 'react';
import { Group, Rect, Line } from 'react-konva';
import { TransformerForProps } from '../../../Layout';
import { transformObject } from '../../../../types/viewport';

interface OwnProps {
  x: number;
  y: number;
  width: number;
  height: number;
  show: boolean;
  action: () => void;
}

type Props = OwnProps & TransformerForProps;

const TriangleUp = (x: number, y: number, base: number, height: number) => (
  <Line
    points={[x + base / 2, y + 0, x + base, y + height, x + 0, y + height]}
    closed={true}
    fill="#4a4a4a"
  />);

const TriangleDown = (x: number, y: number, base: number, height: number) => (
  <Line
    points={[x + 0, y + 0, x + base, y + 0, x + base / 2, y + height]}
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
    triangle: {
      base: 10,
      height: 5,
      x: -5,
      yUp: 8.5,
      yDown: 6.5,
    },
  };

  render() {
    const { transform, x, y, width, height } = this.props;
    const style = transformObject(transform, Toggle.style) as typeof Toggle.style;

    return (
      <Group x={x} y={y} onClick={this.props.action}>
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={style.background.color}
          stroke={style.border.color}
          strokeWidth={style.border.width}
          cornerRadius={style.cornerRadius}
        />
        {this.props.show
          ? TriangleUp(
            width / 2 + style.triangle.x,
            style.triangle.yUp,
            style.triangle.base,
            style.triangle.height
          )
          : TriangleDown(
            width / 2 + style.triangle.x,
            style.triangle.yDown,
            style.triangle.base,
            style.triangle.height
          )}
      </Group>
    );
  }
}

export default Toggle;
