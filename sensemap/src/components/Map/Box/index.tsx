import * as React from 'react';
import { Group, Rect, Text } from 'react-konva';
import TagList from '../TagList';
import * as T from '../../../types';
import * as B from '../../../types/sense/box';
import { noop, toTags } from '../../../types/utils';
import { Event as KonvaEvent } from '../../../types/konva';
import { Point, moveStart, moveEnd } from '../../../graphics/point';

interface GeometryProps {
  x: number;
  y: number;
}

interface Props {
  mapObject: T.ObjectData;
  box: T.BoxData;
  selected?: Boolean;
  transform(g: GeometryProps): GeometryProps;
  inverseTransform(g: GeometryProps): GeometryProps;
  toggleSelection?(e: KonvaEvent.Mouse, data: T.ObjectData): void;
  moveObject?(id: T.ObjectID, x: number, y: number): void;
  openBox?(box: T.BoxID): void;
}

interface State {
  tagHeight: number;
}

const width = B.DEFAULT_WIDTH;
const height = B.DEFAULT_HEIGHT;
const borderColor = '#707070';
const borderWidth = 8;
const bgColor = '#ffffff';
const cornerRadius = 2;

const titlePadding = 0;
const titleWidth = 180;
const titleOffsetX = (width - (titleWidth + titlePadding)) / 2;
const titleFontFamily = 'sans-serif';
const titleColor = '#000000';
const titleFontSize = 20;
const titleLineHeight = 22 / titleFontSize;
const titleOffsetY = (height - titleFontSize) / 2;
const titleLineBreak = 9;
const titleLimit = 18;

const selectedOffsetX = -8;
const selectedOffsetY = -8;
const selectedWidth = width - selectedOffsetY * 2;
const selectedHeight = height - selectedOffsetX * 2;
const selectedCornerRadius = 10;
const selectedColor = '#3ad8fa';
const selectedStrokeWidth = 2;

const tagLeft = 8;
const tagBottom = 8;

class Box extends React.Component<Props, State> {
  state = {
    tagHeight: 0
  };

  render() {
    const { id } = this.props.mapObject;
    const { x, y } = this.props.transform({
      x: this.props.mapObject.x,
      y: this.props.mapObject.y,
    });
    const {title, tags} = this.props.box;
    const sanitizedTitle = title.substr(0, titleLimit);
    const boxID = this.props.box.id;
    const tagHeight = this.state.tagHeight;

    const toggleSelection = this.props.toggleSelection || noop;
    const moveObject      = this.props.moveObject      || noop;
    const openBox         = this.props.openBox         || noop;

    const selected = (
      <Rect
        x={selectedOffsetX}
        y={selectedOffsetY}
        width={selectedWidth}
        height={selectedHeight}
        cornerRadius={selectedCornerRadius}
        stroke={selectedColor}
        strokeWidth={selectedStrokeWidth}
      />);

    const offsetY = sanitizedTitle.length <= titleLineBreak ? titleOffsetY : titleOffsetY - titleFontSize / 2;

    return (
      <Group
        x={x}
        y={y}
        draggable={true}
        onClick={(e) => toggleSelection(e, this.props.mapObject)}
        onDragStart={(e) => moveStart(id, new Point(x, y), new Point(e.evt.layerX, e.evt.layerY))}
        onDragEnd={(e) => {
          const r = moveEnd(id, new Point(e.evt.layerX, e.evt.layerY));
          const p = this.props.inverseTransform({ x: r.x, y: r.y });
          return moveObject(id, p.x, p.y);
        }}
        onDblClick={() => openBox(boxID)}
      >
        {this.props.selected ? selected : null}
        <Rect
          fill={bgColor}
          width={width}
          height={height}
          stroke={borderColor}
          strokeWidth={borderWidth}
          cornerRadius={cornerRadius}
        />
        <Text
          x={titleOffsetX}
          y={offsetY}
          align="center"
          width={titleWidth}
          fill={titleColor}
          fontFamily={titleFontFamily}
          fontSize={titleFontSize}
          lineHeight={titleLineHeight}
          padding={titlePadding}
          text={title}
        />
        <TagList
          x={tagLeft}
          y={height - tagBottom - tagHeight}
          tags={toTags(tags)}
          onResize={(w, h) => this.setState({ tagHeight: h })}
        />
      </Group>
    );
  }
}

export default Box;
