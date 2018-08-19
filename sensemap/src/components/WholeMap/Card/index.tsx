import * as React from 'react';
import { Group, Rect } from 'react-konva';
import { TransformerForProps } from '../../Layout';
import { ObjectData, CardID, CardData, CardType } from '../../../types';
import { BoundingBox } from '../../../graphics/drawing';
import { transformObject } from '../../../types/viewport';
import { noop } from '../../../types/utils';
import { Event as KonvaEvent } from '../../../types/konva';

interface OwnProps {
  mapObject: ObjectData;
  selected?: Boolean;
  onSelect?(e: KonvaEvent.Mouse, object: ObjectData): void;
  onDeselect?(e: KonvaEvent.Mouse, object: ObjectData): void;
  onMouseOver?(e: KonvaEvent.Mouse, object: ObjectData): void;
  onMouseOut?(e: KonvaEvent.Mouse, object: ObjectData): void;
  onDragStart?(e: KonvaEvent.Mouse, object: ObjectData): void;
  onDragMove?(e: KonvaEvent.Mouse, object: ObjectData): void;
  onDragEnd?(e: KonvaEvent.Mouse, object: ObjectData): void;
  onOpen?(e: KonvaEvent.Mouse, data: CardID): void;
}

type Props = OwnProps & BoundingBox & CardData & TransformerForProps;

type OwnState = {
  newlySelected: boolean;
};

class Card extends React.PureComponent<Props, OwnState> {
  static style = {
    backgroundColor: {
      [CardType.ANSWER]: '#c0e2d8',
      [CardType.NORMAL]: '#d8d8d8',
      [CardType.NOTE]: '#ffe384',
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

  state = {
    newlySelected: false,
  };

  render() {
    const {
      transform,
      mapObject,
      selected = false,
      cardType,
      onSelect = noop,
      onDeselect = noop,
      onMouseOver = noop,
      onMouseOut = noop,
      onDragStart = noop,
      onDragMove = noop,
      onDragEnd = noop,
      onOpen = noop,
    } = this.props;
    const { newlySelected } = this.state;
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
      <Group
        draggable
        x={x}
        y={y}
        onMouseDown={(e: KonvaEvent.Mouse) => {
          e.cancelBubble = true;
          if (selected) { return; }
          this.setState({ newlySelected: true });
          onSelect(e, mapObject);
        }}
        onClick={(e: KonvaEvent.Mouse) => {
          e.cancelBubble = true;
          if (!newlySelected) {
            onDeselect(e, mapObject);
          }
          this.setState({ newlySelected: false });
        }}
        onDblClick={(e: KonvaEvent.Mouse) => {
          onSelect(e, mapObject);
          onOpen(e, mapObject.data);
        }}
        onMouseOver={(e: KonvaEvent.Mouse) => onMouseOver(e, mapObject)}
        onMouseOut={(e: KonvaEvent.Mouse) => onMouseOut(e, mapObject)}
        onDragStart={(e: KonvaEvent.Mouse) => onDragStart(e, mapObject)}
        onDragMove={(e: KonvaEvent.Mouse) => onDragMove(e, mapObject)}
        onDragEnd={(e: KonvaEvent.Mouse) => onDragEnd(e, mapObject)}
      >
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