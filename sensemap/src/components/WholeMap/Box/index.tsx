import * as React from 'react';
import { Group, Rect, Text } from 'react-konva';
import { TransformerForProps } from '../';
import { ObjectData, BoxData } from '../../../types';
import { BoundingBox } from '../../../graphics/drawing';
import { transformObject } from '../../../types/viewport';
import { noop } from '../../../types/utils';
import { Event as KonvaEvent } from '../../../types/konva';

interface OwnProps {
  mapObject: ObjectData;
  selected?: Boolean;
  onMouseOver?(e: KonvaEvent.Mouse, object: ObjectData): void;
  onMouseOut?(e: KonvaEvent.Mouse, object: ObjectData): void;
  onSelect?(e: KonvaEvent.Mouse, object: ObjectData): void;
  onDeselect?(e: KonvaEvent.Mouse, object: ObjectData): void;
  onDragStart?(e: KonvaEvent.Mouse, object: ObjectData): void;
  onDragMove?(e: KonvaEvent.Mouse, object: ObjectData): void;
  onDragEnd?(e: KonvaEvent.Mouse, object: ObjectData): void;
}

interface OwnState {
  newlySelected: boolean;
}

type Props = OwnProps & BoundingBox & BoxData & TransformerForProps;

class Box extends React.PureComponent<Props, OwnState> {
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
      onDragEnd = noop
    } = this.props;
    const { x, y, width, height } = transform({
      x: this.props.x,
      y: this.props.y,
      width: this.props.width,
      height: this.props.height,
    });
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
      <Group x={x} y={y}>
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
        <Rect
          width={width}
          height={height}
          onMouseOver={(e: KonvaEvent.Mouse) => onMouseOver(e, mapObject)}
          onMouseOut={(e: KonvaEvent.Mouse) => onMouseOut(e, mapObject)}
          onMouseDown={
            (e: KonvaEvent.Mouse) =>
              selected ? onDeselect(e, mapObject) : onSelect(e, mapObject)
          }
          onDragStart={(e: KonvaEvent.Mouse) => onDragStart(e, mapObject)}
          onDragMove={(e: KonvaEvent.Mouse) => onDragMove(e, mapObject)}
          onDragEnd={(e: KonvaEvent.Mouse) => onDragEnd(e, mapObject)}
        />
      </Group>
    );
  }
}

export default Box;