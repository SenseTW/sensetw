import * as React from 'react';
import { Group, Rect } from 'react-konva';
import { TransformerForProps } from '../';
import { ObjectData, CardData, CardType } from '../../../types';
import { BoundingBox } from '../../../graphics/drawing';
import { transformObject } from '../../../types/viewport';

interface OwnProps {
  mapObject: ObjectData;
  selected?: boolean;
}

type Props = OwnProps & BoundingBox & CardData & TransformerForProps;

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
    },
    selected: {
      borderRadius: 27,
      color: '#3ad8fa',
      offset: {
        x: -18,
        y: -18,
      },
      strokeWidth: 9,
    }
  };

  render() {
    const { transform, selected, cardType } = this.props;
    // TODO: should I use the object dimension or the style dimension?
    const { x, y, width, height } = transform({
      x: this.props.x,
      y: this.props.y,
      width: this.props.width,
      height: this.props.height,
    });
    const style = transformObject(transform, Card.style) as typeof Card.style;

    const selectedWidth = width - style.selected.offset.x * 2;
    const selectedHeight = height - style.selected.offset.y * 2;
    const selectedRect = selected && (
      <Rect
        x={style.selected.offset.x}
        y={style.selected.offset.y}
        width={selectedWidth}
        height={selectedHeight}
        cornerRadius={style.selected.borderRadius}
        stroke={style.selected.color}
        strokeWidth={style.selected.strokeWidth}
      />
    );

    return (
      <Group x={x} y={y}>
        {selectedRect}
        <Rect
          width={width}
          height={height}
          cornerRadius={style.borderRadius}
          fill={style.backgroundColor[cardType]}
        />
      </Group>
    );
  }
}

export default Card;