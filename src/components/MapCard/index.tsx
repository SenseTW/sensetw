
import * as React from 'react';
import { Group, Rect, Text } from 'react-konva';
import * as SM from '../../types/sense-map';

interface Props {
  mapObject: SM.MapObject;
}

const titlePadding = 14;
const titleFontFamily = 'sans-serif';
const titleFontSize = 14;
const bgColors = {
  'NORMAL': '#ffffff',
  'NOTE': '#ffffff',
  'QUESTION': '#ff9999',
  'ANSWER': '#a7ccf2',
};
const shadowBlur = 5;
const shadowColor = '#999';
const shadowOffsetX = (shadowBlur) / 4;
const shadowOffsetY = shadowBlur;

function MapCard(props: Props) {
  const {id, x, y, width, height} = props.mapObject;
  const {title, cardType} = props.mapObject.data;
  const bgColor = bgColors[cardType];
  return (
    <Group draggable={true} x={x} y={y} key={id}>
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
