
import * as React from 'react';
import { Group, Rect, Text } from 'react-konva';
import * as SO from '../../types/sense-object';
import * as SB from '../../types/sense-box';
import { noop } from '../../types/utils';
import { moveStart, moveEnd } from '../../tools/point';

interface Props {
  mapObject: SO.ObjectData;
  box: SB.BoxData;
  selected?: Boolean;
  toggleSelection?(id: SO.ObjectID): void;
  moveObject?(id: SO.ObjectID, x: number, y: number): void;
  openBox?(box: SB.BoxID): void;
}

const width = 300;
const height = 120;
const borderColor = '#00ffd2';
const borderColorSelected = '#ff21c7';
const borderWidth = 8;
const bgColor = '#ffffff';
const titleFontFamily = 'sans-serif';
const titleColor = '#000000';
const titleFontSize = 36;
const titlePadding = 5;

function MapBox(props: Props) {
  const {id, x, y} = props.mapObject;
  const {title} = props.box;
  const boxID = props.box.id;

  const toggleSelection = props.toggleSelection || noop;
  const moveObject      = props.moveObject      || noop;
  const openBox         = props.openBox         || noop;
  return (
    <Group
      x={x}
      y={y}
      key={id}
      draggable={true}
      onClick={() => toggleSelection(id)}
      onDragStart={(e) => moveStart(id, x, y, e.evt.layerX, e.evt.layerY)}
      onDragEnd={(e) => {
        // XXX TypeScript ought to understand this...
        // return moveObject(id, ...moveEnd(id, e.evt.layerX, e.evt.layerY));
        const r = moveEnd(id, e.evt.layerX, e.evt.layerY);
        return moveObject(id, r[0], r[1]);
      }}
      onDblClick={() => openBox(boxID)}
    >
      <Rect
        fill={bgColor}
        width={width}
        height={height}
        stroke={props.selected ? borderColorSelected : borderColor}
        strokeWidth={borderWidth}
      />
      <Text
        y={(height - titleFontSize) / 2}
        align="center"
        width={width}
        height={height}
        stroke={titleColor}
        strokeWidth={1}
        fontFamily={titleFontFamily}
        fontSize={titleFontSize}
        padding={titlePadding}
        text={title}
      />
    </Group>
  );
}

export default MapBox;
