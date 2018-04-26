
import * as React from 'react';
import { Group, Rect, Text } from 'react-konva';
import * as SO from '../../types/sense-object';
import * as SC from '../../types/sense-card';
import { noop } from '../../types/utils';

interface Props {
  mapObject: SO.ObjectData;
  card: SC.CardData;
  selected?: Boolean;
  toggleSelection?(id: SO.ObjectID): void;
}

const titlePadding = 14;
const titleFontFamily = 'sans-serif';
const titleFontSize = 14;
const borderColor = '#999';
const borderColorSelected = '#9999ff';
const bgColors = {
  'Normal': '#ffffff',
  'Note': '#ffffff',
  'Question': '#ff9999',
  'Answer': '#a7ccf2',
};
const shadowBlur = 5;
const shadowColor = '#999';
const shadowOffsetX = (shadowBlur) / 4;
const shadowOffsetY = shadowBlur;

function MapCard(props: Props) {
  const {id, x, y, width, height} = props.mapObject;
  const {title, cardType} = props.card;
  const toggleSelection = props.toggleSelection || noop;
  const bgColor = bgColors[SC.typeToString(cardType)];
  return (
    <Group draggable={true} x={x} y={y} key={id} onClick={() => toggleSelection(id)}>
      <Rect
        width={width}
        height={height}
        shadowBlur={shadowBlur}
        shadowOffsetX={shadowOffsetX}
        shadowOffsetY={shadowOffsetY}
        shadowColor={shadowColor}
        fill={bgColor}
      />
      <Rect
        width={width}
        height={height}
        fill={bgColor}
        stroke={props.selected ? borderColorSelected : borderColor}
      />
      <Text
        width={width}
        height={height}
        padding={titlePadding}
        fontSize={titleFontSize}
        fontFamily={titleFontFamily}
        text={title}
      />
    </Group>
  );
}

export default MapCard;
