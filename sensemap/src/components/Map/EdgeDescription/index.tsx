import * as React from 'react';
import { Group, Rect } from 'react-konva';
import { TransformerForProps } from '../../Layout';
import { Edge } from '../../../types';
import Caret from '../../Layout/Caret';
import Text from '../../Layout/Text';
import { SQRT3 } from '../../../types/utils';

interface OwnProps {
  edge: Edge;
  x?: number;
  y?: number;
}

interface OwnState {
  height: number;
}

type Props = OwnProps & TransformerForProps;

class EdgeDescription extends React.PureComponent<Props, OwnState> {
  static style = {
    backgroundColor: '#b3e5fc',
    borderRadius: 6,
    caret: {
      offset: {
        x: 1,
        y: 4,
      },
      height: 8,
      base: SQRT3 / 3 * 2 * 8,
    },
    color: '#000',
    fontSize: 16,
    lineHeight: 1.2,
    width: 200,
    margin: {
      left: 18,
    },
    padding: {
      top: 6,
      right: 6,
      bottom: 6,
      left: 6,
    },
  };

  state = {
    height: 0,
  };

  handleResize = (width: number, height: number) => {
    this.setState({ height });
  }

  render() {
    const { transform, edge } = this.props;
    // use the untransformed style
    const style = EdgeDescription.style;
    const width = style.width;
    const { x, y } = transform({
      x: this.props.x,
      y: this.props.y,
    });
    const textWidth = style.width - style.padding.left - style.padding.right;
    const fontSize = style.fontSize;
    const { height: innerHeight } = this.state;
    const height = style.padding.top + innerHeight + style.padding.bottom;

    return (
      <Group
        x={x + style.margin.left}
        y={y - style.caret.offset.y - style.caret.base / 2}
      >
        <Caret
          left
          x={style.caret.offset.x}
          y={style.caret.offset.y + style.caret.base / 2}
          base={style.caret.base}
          height={style.caret.height}
          fill={style.backgroundColor}
        />
        <Rect
          width={width}
          height={height}
          cornerRadius={style.borderRadius}
          fill={style.backgroundColor}
        />
        <Text
          x={style.padding.left}
          y={style.padding.top}
          width={textWidth}
          fontSize={fontSize}
          lineHeight={style.lineHeight}
          text={edge.title || edge.summary}
          onResize={this.handleResize}
        />
      </Group>
    );
  }
}

export default EdgeDescription;