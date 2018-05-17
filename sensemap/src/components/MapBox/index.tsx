import * as React from 'react';
import { Group, Rect, Text } from 'react-konva';
import MapTagList from '../MapTagList';
import * as T from '../../types';
import * as B from '../../types/sense-box';
import { noop, toTags } from '../../types/utils';
import { moveStart, moveEnd } from '../../graphics/point';

interface Props {
  mapObject: T.ObjectData;
  box: T.BoxData;
  selected?: Boolean;
  toggleSelection?(id: T.ObjectID): void;
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

class MapBox extends React.Component<Props, State> {
  state = {
    tagHeight: 0
  };

  render() {
    const {id, x, y} = this.props.mapObject;
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
    // tslint:disable-next-line:no-console
    console.log(titleOffsetY, offsetY, sanitizedTitle.length);

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
        <MapTagList
          x={tagLeft}
          y={height - tagBottom - tagHeight}
          tags={toTags(tags)}
          onResize={(w, h) => this.setState({ tagHeight: h })}
        />
      </Group>
    );
  }
}

export default MapBox;
