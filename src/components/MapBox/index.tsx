
import * as React from 'react';
import { Group, Rect, Text } from 'react-konva';
import * as SO from '../../types/sense-object';
import * as SB from '../../types/sense-box';
import { noop } from '../../types/utils';

interface Props {
  mapObject: SO.ObjectData;
  box: SB.BoxData;
  selected?: Boolean;
  toggleSelection?(id: SO.ObjectID): void;
}

const borderColor = '#21ffc7';
const borderColorSelected = '#ff21c7';
const borderWidth = 6;
const bgColor = '#ffffff';
const titleFontFamily = 'sans-serif';
const titleColor = '#000000';
const titleFontSize = 28;
const titlePadding = 5;

function MapBox(props: Props) {
  const {id, x, y, width, height} = props.mapObject;
  const {title} = props.box;
  const toggleSelection = props.toggleSelection || noop;
  return (
    <Group x={x} y={y} draggable={true} key={id} onClick={() => toggleSelection(id)}>
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
