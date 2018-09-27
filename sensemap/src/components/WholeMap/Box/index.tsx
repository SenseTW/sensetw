import * as React from 'react';
import { Group, Rect, Text } from 'react-konva';
import { MapObjectForProps } from '../../Map/props';
import Selectable from '../../Layout/Selectable';
import { rectFromBox } from '../../../graphics/drawing';
import { BoxType, BoxData } from '../../../types';
import { transformObject } from '../../../types/viewport';
import { noop } from '../../../types/utils';
import { Event as KonvaEvent } from '../../../types/konva';

type Props = MapObjectForProps<BoxData>;

const colors = {
  [BoxType.NOTE]: { backgroundColor: '#ffe384', color: '#4a4a4a' },
  [BoxType.PROBLEM]: { backgroundColor: '#ffb2be', color: '#4a4a4a' },
  [BoxType.SOLUTION]: { backgroundColor: '#9ae0ff', color: '#4a4a4a' },
  [BoxType.DEFINITION]: { backgroundColor: '#defff5', color: '#4a4a4a' },
  [BoxType.INFO]: { backgroundColor: '#484848', color: '#ffffff' },
};

const colorFromType = (cardType: BoxType): { backgroundColor: string, color: string } =>
  colors[cardType] || colors[BoxType.INFO];

class Box extends React.PureComponent<Props> {
  static style = {
    borderRadius: 18,
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
    }
  };

  render() {
    const {
      transform,
      draggable,
      object,
      data,
      selected = false,
      onMouseOver = noop,
      onMouseOut = noop,
      onSelect = noop,
      onDeselect = noop,
      onDragStart = noop,
      onDragMove = noop,
      onDragEnd = noop,
      onOpen = noop,
    } = this.props;
    const { backgroundColor, color } = colorFromType(data.boxType);
    const transformed = transform(object);
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
          onSelect(e, object);
        }}
        onDeselect={(e: KonvaEvent.Mouse) => {
          e.cancelBubble = true;
          onDeselect(e, object);
        }}
      >
        <Group
          draggable={draggable}
          x={x}
          y={y}
          onMouseOver={(e: KonvaEvent.Mouse) => onMouseOver(e, object)}
          onMouseOut={(e: KonvaEvent.Mouse) => onMouseOut(e, object)}
          onDblClick={(e: KonvaEvent.Mouse) => {
            onSelect(e, object);
            onOpen(e, data.id);
          }}
          onDragStart={(e: KonvaEvent.Mouse) => onDragStart(e, object)}
          onDragMove={(e: KonvaEvent.Mouse) => onDragMove(e, object)}
          onDragEnd={(e: KonvaEvent.Mouse) => onDragEnd(e, object)}
        >
          {selectedRect}
          <Rect
            width={width}
            height={height}
            cornerRadius={style.borderRadius}
            fill={backgroundColor}
          />
          <Text
            x={style.padding.left}
            y={style.padding.top}
            width={textWidth}
            height={textHeight}
            fontSize={style.fontSize}
            fill={color}
            text={data.title}
          />
        </Group>
      </Selectable>
    );
  }
}

export default Box;