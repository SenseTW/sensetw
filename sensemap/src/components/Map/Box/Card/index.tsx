import * as React from 'react';
import { TransformerForProps } from '../../../Layout';
import { Group, Rect, Text } from 'react-konva';
import * as T from '../../../../types';
import { transformObject } from '../../../../types/viewport';

interface OwnProps {
  card: T.CardData;
  x: number;
  y: number;
  width: number;
  height: number;
}

type Props = OwnProps & TransformerForProps;

class Card extends React.Component<Props> {

  static style = {
    height: 70,
    background: {
      color: '#ffffff',
    },
    cornerRadius: 4,
    border: {
      color: '#dddddd',
      width: 1,
    },
    contents: {
      title: {
        left: 20,
        top: 17,
        color: '#000000',
        height: 40,
        width: 320 - 20 * 2,
        textLimit: 34,
        font: {
          family: 'sans-serif',
          size: 16,
        },
        lineHeight: 20 / 16,
      },
    },
  };

  render() {
    const { transform, x = 0, y = 0, width = 0, height = 0 } = this.props;
    const style = transformObject(transform, Card.style) as typeof Card.style;
    const text = (this.props.card.summary || this.props.card.description || '')
      .substr(0, Card.style.contents.title.textLimit);
    return (
      <Group x={x} y={y}>
        <Rect
          width={width}
          height={height}
          fill={style.background.color}
          stroke={style.border.color}
          strokeWidth={style.border.width}
          cornerRadius={style.cornerRadius}
        />
        <Text
          x={style.contents.title.left}
          y={style.contents.title.top}
          width={style.contents.title.width}
          height={style.contents.title.height}
          fill={style.contents.title.color}
          fontFamily={style.contents.title.font.family}
          fontSize={style.contents.title.font.size}
          lineHeight={style.contents.title.lineHeight}
          text={text}
        />
      </Group>
    );
  }
}

export default Card;
