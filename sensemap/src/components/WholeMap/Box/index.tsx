import * as React from 'react';
import { Rect } from 'react-konva';
import { TransformerForProps } from '../';
import { BoxData } from '../../../types';
import { BoundingBox } from '../../../graphics/drawing';
import { transformObject } from '../../../types/viewport';

type Props = BoundingBox & BoxData & TransformerForProps;

class Box extends React.PureComponent<Props> {
  static style = {
    backgroundColor: '#4d4d4d',
    borderRadius: 18,
    width: 216,
    height: 96,
    padding: {
      top: 12,
      right: 9,
      bottom: 12,
      left: 9,
    },
  };

  render() {
    const { transform } = this.props;
    const { x, y, width, height } = transform({
      x: this.props.x,
      y: this.props.y,
      width: this.props.width,
      height: this.props.height,
    });
    const style = transformObject(transform, Box.style) as typeof Box.style;

    return (
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        cornerRadius={style.borderRadius}
        fill={style.backgroundColor}
      />
    );
  }
}

export default Box;