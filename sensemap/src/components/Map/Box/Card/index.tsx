import * as React from 'react';
import { TransformerForProps, LayoutForProps } from '../../../Layout';
import Text from '../../../Layout/Text';
import { Group, Rect } from 'react-konva';
import * as T from '../../../../types';
import { noop } from '../../../../types/utils';
import { transformObject } from '../../../../types/viewport';

interface OwnProps {
  card: T.CardData;
  x?: number;
  y?: number;
  width?: number;
}

type Props = OwnProps & LayoutForProps & TransformerForProps;

interface State {
  width: number;
  height: number;
}

class Card extends React.PureComponent<Props, State> {

  static style = {
    width: 320,
    padding: {
      top: 17,
      right: 20,
      bottom: 17,
      left: 20,
    },
    background: {
      color: '#ffffff',
    },
    border: {
      color: '#dddddd',
      width: 1,
    },
    contents: {
      color: '#000000',
      font: {
        family: 'sans-serif',
        size: 16,
      },
      lineHeight: 20 / 16,
    },
  };

  state = {
    width: 0,
    height: 0,
  };

  handleResize = (width: number, height: number): void => {
    const { transform, onResize = noop } = this.props;
    const { padding } = transformObject(transform, Card.style) as typeof Card.style;

    this.setState({ width, height });
    onResize(
      padding.left + width + padding.right,
      padding.top + height + padding.bottom,
    );
  }

  render() {
    const { transform, x = 0, y = 0, width = 0 } = this.props;
    const style = transformObject(transform, Card.style) as typeof Card.style;
    const { height: innerHeight } = this.state;
    const innerWidth = width - style.padding.left - style.padding.right;
    const height = style.padding.top + innerHeight + style.padding.bottom;
    const text = (this.props.card.summary || this.props.card.description || '');

    return (
      <Group x={x} y={y}>
        <Rect
          width={width}
          height={height}
          fill={style.background.color}
          stroke={style.border.color}
          strokeWidth={style.border.width}
        />
        <Text
          x={style.padding.left}
          y={style.padding.top}
          width={innerWidth}
          fill={style.contents.color}
          fontFamily={style.contents.font.family}
          fontSize={style.contents.font.size}
          lineHeight={style.contents.lineHeight}
          text={text}
          onResize={this.handleResize}
        />
      </Group>
    );
  }
}

export default Card;
