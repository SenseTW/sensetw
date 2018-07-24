import * as React from 'react';
import { Rect } from 'react-konva';
import { TransformerForProps } from '../';
import { CardData, CardType } from '../../../types';
import { BoundingBox } from '../../../graphics/drawing';
import { transformObject } from '../../../types/viewport';

type Props = BoundingBox & CardData & TransformerForProps;

class Card extends React.PureComponent<Props> {
  static style = {
    backgroundColor: {
      [CardType.ANSWER]: '#c0e2d8',
      [CardType.NORMAL]: '#d8d8d8',
      [CardType.NOTE]: '#d8d8d8',
      [CardType.QUESTION]: '#e5ced1',
    },
    borderRadius: 9,
    width: 126,
    height: 84,
    padding: {
      top: 12,
      right: 9,
      bottom: 12,
      left: 9,
    }
  };

  render() {
    const { transform, cardType } = this.props;
    // TODO: should I use the object dimension or the style dimension?
    const { x, y, width, height } = transform({
      x: this.props.x,
      y: this.props.y,
      width: this.props.width,
      height: this.props.height,
    });
    const style = transformObject(transform, Card.style) as typeof Card.style;

    return (
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        cornerRadius={style.borderRadius}
        fill={style.backgroundColor[cardType]}
      />
    );
  }
}

export default Card;