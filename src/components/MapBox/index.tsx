
import * as React from 'react';
import { Group, Rect, Text } from 'react-konva';
import * as SM from '../../types/sense-map';

interface Props {
  mapObject: SM.MapObject;
}

const borderColor = '#21ffc7';
const borderWidth = 6;
const bgColor = '#ffffff';
const titleFontFamily = 'sans-serif';
const titleColor = '#000000';
const titleFontSize = 28;
const titlePadding = 5;

function MapBox(props: Props) {
  const {id, x, y, width, height} = props.mapObject;
  const {title} = props.mapObject.data;
  return (
    <Group x={x} y={y} draggable={true} key={id}>
      <Rect fill={bgColor} width={width} height={height} stroke={borderColor} strokeWidth={borderWidth} />
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
