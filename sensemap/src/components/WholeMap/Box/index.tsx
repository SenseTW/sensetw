import * as React from 'react';
import { Group, Rect, Text } from 'react-konva';
import { TransformerForProps } from '../../Layout';
import Selectable from '../../Layout/Selectable';
import { rectFromBox } from '../../../graphics/drawing';
import { ObjectData, BoxID, BoxData } from '../../../types';
import { BoundingBox } from '../../../graphics/drawing';
import { transformObject } from '../../../types/viewport';
import { noop } from '../../../types/utils';
import { Event as KonvaEvent } from '../../../types/konva';

interface OwnProps {
  mapObject: ObjectData;
  selected?: boolean;
  onMouseOver?(e: KonvaEvent.Mouse, object: ObjectData): void;
  onMouseOut?(e: KonvaEvent.Mouse, object: ObjectData): void;
  onSelect?(e: KonvaEvent.Mouse, object: ObjectData): void;
  onDeselect?(e: KonvaEvent.Mouse, object: ObjectData): void;
  onDragStart?(e: KonvaEvent.Mouse, object: ObjectData): void;
  onDragMove?(e: KonvaEvent.Mouse, object: ObjectData): void;
  onDragEnd?(e: KonvaEvent.Mouse, object: ObjectData): void;
  onOpen?(e: KonvaEvent.Mouse, data: BoxID): void;
}

type Props = OwnProps & BoundingBox & BoxData & TransformerForProps;

class Box extends React.PureComponent<Props> {
  static style = {
    backgroundColor: '#4d4d4d',
    borderRadius: 18,
    color: '#fff',
    fontSize: 36,
    width: 216,
    height: 96,
    padding: {
      top: 30,
      right: 18,
      bottom: 30,
      left: 18,
    },
    selected: {
      borderRadius: 36,
      color: '#3ad8fa',
      offset: {
        x: -18,
        y: -18,
      },
      strokeWidth: 9,
    },
    hover: {
      backgroundColor: '#b3e5fc',
      borderRadius: 18,
      color: '#000',
      width: 630,
      height: 750,
      margin: {
        left: 36,
      }
    }
  };

  state = {
    newlySelected: false,
    hover: false,
  };

  render() {
    const {
      transform,
      mapObject,
      selected = false,
      title,
      onMouseOver = noop,
      onMouseOut = noop,
      onSelect = noop,
      onDeselect = noop,
      onDragStart = noop,
      onDragMove = noop,
      onDragEnd = noop,
      onOpen = noop,
    } = this.props;
    const transformed = transform({
      x: this.props.x,
      y: this.props.y,
      width: this.props.width,
      height: this.props.height,
    });
    const { width, height } = transformed;
    const { left: x, top: y } = rectFromBox(transformed);
    const style = transformObject(transform, Box.style) as typeof Box.style;

    const selectedWidth = width  - style.selected.offset.x * 2;
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

    const textWidth = width - style.padding.left - style.padding.right;
    const textHeight = height - style.padding.top - style.padding.bottom;

    return (
      <Selectable
        selected={selected}
        onSelect={(e: KonvaEvent.Mouse) => {
          e.cancelBubble = true;
          onSelect(e, mapObject);
        }}
        onDeselect={(e: KonvaEvent.Mouse) => {
          e.cancelBubble = true;
          onDeselect(e, mapObject);
        }}
      >
        <Group
          draggable
          x={x}
          y={y}
          onMouseOver={(e: KonvaEvent.Mouse) => onMouseOver(e, mapObject)}
          onMouseOut={(e: KonvaEvent.Mouse) => onMouseOut(e, mapObject)}
          onDblClick={(e: KonvaEvent.Mouse) => {
            onSelect(e, mapObject);
            onOpen(e, mapObject.data);
          }}
          onDragStart={(e: KonvaEvent.Mouse) => onDragStart(e, mapObject)}
          onDragMove={(e: KonvaEvent.Mouse) => onDragMove(e, mapObject)}
          onDragEnd={(e: KonvaEvent.Mouse) => onDragEnd(e, mapObject)}
        >
          {selectedRect}
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
            height={textHeight}
            fontSize={style.fontSize}
            fill={style.color}
            text={title}
          />
        </Group>
      </Selectable>
    );
  }
}

export default Box;