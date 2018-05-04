
import * as React from 'react';
import { Group, Rect, Text } from 'react-konva';
import * as SO from '../../types/sense-object';
import * as SC from '../../types/sense-card';
import { noop } from '../../types/utils';
import { moveStart, moveEnd } from '../../tools/point';

interface Props {
  mapObject: SO.ObjectData;
  card: SC.CardData;
  selected?: Boolean;
  toggleSelection?(id: SO.ObjectID): void;
  moveObject?(id: SO.ObjectID, x: number, y: number): void;
}

const width = 300;
const height = 180;
const cornerRadius = 4;
const titlePadding = 10;
const titleHeight = 130;
const titleFontFamily = 'sans-serif';
const titleFontSize = 16;
// const borderColor = '#999';
// const borderColorSelected = '#9999ff';
// const strokeWidth = 0;
const shadowBlur = 10;
const shadowColor = '#999';
const shadowOffsetX = 2;
const shadowOffsetY = 3;

function MapCard(props: Props) {
  const {id, x, y} = props.mapObject;
  const {title, cardType} = props.card;

  const toggleSelection = props.toggleSelection || noop;
  const moveObject      = props.moveObject      || noop;
  const bgColor = SC.color[cardType];
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
    >
      <Rect
        width={width}
        height={height}
        fill={bgColor}
        cornerRadius={cornerRadius}
        shadowBlur={shadowBlur}
        shadowOffsetX={shadowOffsetX}
        shadowOffsetY={shadowOffsetY}
        shadowColor={shadowColor}
//        stroke={props.selected ? borderColorSelected : borderColor}
//        strokeWidth={strokeWidth}
      />
      <Text
        width={width}
        height={titleHeight}
        padding={titlePadding}
        fontSize={titleFontSize}
        fontFamily={titleFontFamily}
        text={title}
      />
    </Group>
  );
}

export default MapCard;
