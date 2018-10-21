import * as React from 'react';
import { Path } from 'react-konva';

interface Props {
  top?: boolean;
  right?: boolean;
  bottom?: boolean;
  left?: boolean;
  x?: number;
  y?: number;
  base?: number;
  height?: number;
  fill: string;
}

class Caret extends React.PureComponent<Props> {
  render() {
    let { top } = this.props;
    const {
      right,
      bottom,
      left,
      x = 0,
      y = 0,
      base = 0,
      height = 0,
      fill,
    } = this.props;
    if (!top && !right && !left && !bottom) { top = true; }

    if (base <= 0 || height <= 0) { return null; }

    if (top) {
      return (
        <Path
           x={x}
           y={y}
           data={`M${0} ${-height} L${base / 2} ${0} h${-base} L${0}, ${-height}z`}
           fill={fill}
        />
      );
    } else if (right) {
      return (
        <Path
           x={x}
           y={y}
           data={`M${height} ${0} L${0} ${base / 2} v${-base} L${height} ${0}z`}
           fill={fill}
        />
      );
    } else if (bottom) {
      return (
        <Path
           x={x}
           y={y}
           data={`M${0} ${height} L${-base / 2} ${0} h${base} L${0} ${height}z`}
           fill={fill}
        />
      );
    } else if (left) {
      return (
        <Path
           x={x}
           y={y}
           data={`M${-height} ${0} L${0} ${-base / 2} v${base} L${-height} ${0}z`}
           fill={fill}
        />
      );
    } else {
      return null as never;
    }
  }
}

export default Caret;