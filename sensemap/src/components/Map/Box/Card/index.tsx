import * as React from 'react';
import * as T from '../../../../types';
import { Group, Rect, Text } from 'react-konva';

interface Props {
  card: T.CardData;
  x: number;
  y: number;
  width: number;
  height: number;
}

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
    const { x = 0, y = 0, width = 0, height = 0 } = this.props;
    const text = (this.props.card.summary || this.props.card.description || '')
      .substr(0, Card.style.contents.title.textLimit);
    return (
      <Group x={x} y={y}>
        <Rect
          width={width}
          height={height}
          fill={Card.style.background.color}
          stroke={Card.style.border.color}
          strokeWidth={Card.style.border.width}
          cornerRadius={Card.style.cornerRadius}
        />
        <Text
          x={Card.style.contents.title.left}
          y={Card.style.contents.title.top}
          width={Card.style.contents.title.width}
          height={Card.style.contents.title.height}
          fill={Card.style.contents.title.color}
          fontFamily={Card.style.contents.title.font.family}
          fontSize={Card.style.contents.title.font.size}
          lineHeight={Card.style.contents.title.lineHeight}
          text={text}
        />
      </Group>
    );
  }
}

export default Card;
