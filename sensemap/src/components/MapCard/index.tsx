
import * as React from 'react';
import { Group, Rect, Text } from 'react-konva';
import * as T from '../../types';
import { noop } from '../../types/utils';
import { moveStart, moveEnd } from '../../graphics/point';

interface Props {
  mapObject: T.ObjectData;
  card: T.CardData;
  selected?: Boolean;
  toggleSelection?(id: T.ObjectID): void;
  moveObject?(id: T.ObjectID, x: number, y: number): void;
  openCard?(id: T.CardID): void;
}

const width = 240;
const height = 160;
const cornerRadius = 4;

const summaryPadding = 0;
const summaryOffsetX = 10 - summaryPadding;
const summaryOffsetY = 8 - summaryPadding;
const summaryWidth = width - summaryOffsetX * 2;
const summaryFontFamily = 'sans-serif';
const summaryFontSize = 16;
const summaryAbsoluteLineHegiht = 22;
const summaryLineHeight = summaryAbsoluteLineHegiht / summaryFontSize;
const summaryHeight = summaryAbsoluteLineHegiht * 3;
const summaryColor = '#000000';
const summaryLimit = 39;

const titlePadding = 0;
const titleOffsetX = 10 - titlePadding;
const titleOffsetY = 12 + summaryHeight - summaryPadding - titlePadding;
const titleWidth = width - titleOffsetX * 2;
const titleFontFamily = 'sans-serif';
const titleFontSize = 13;
const titleAbsoluteLineHeight = 16;
const titleLineHeight = titleAbsoluteLineHeight / titleFontSize;
const titleHeight = titleAbsoluteLineHeight * 2;
const titleColor = '#5a5a5a';
const titleLimit = 32;

const color = {
  [T.CardType.NORMAL]: 'rgba(255, 255, 255, 1)',
  [T.CardType.NOTE]: 'rgba(255, 255, 255, 1)',
  [T.CardType.QUESTION]: 'rgba(255, 236, 239, 1)',
  [T.CardType.ANSWER]: 'rgba(222, 255, 245, 1)'
};

const shadowBlur = 10;
const shadowColor = '#999';
const shadowOffsetX = 2;
const shadowOffsetY = 3;

const selectedOffsetX = -6;
const selectedOffsetY = -6;
const selectedWidth = width - selectedOffsetX * 2;
const selectedHeight = height - selectedOffsetY * 2;
const selectedCornerRadius = 8;
const selectedColor = '#3ad8fa';
const selectedStrokeWidth = 3;

function MapCard(props: Props) {
  const {id, x, y, data} = props.mapObject;
  const {title, summary, cardType} = props.card;
  const sanitizedSummary = summary.substr(0, summaryLimit);
  const sanitizedTitle   = title.substr(0, titleLimit);

  const toggleSelection = props.toggleSelection || noop;
  const moveObject      = props.moveObject      || noop;
  const openCard        = props.openCard        || noop;
  const bgColor         = color[cardType];

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
      onDblClick={() => openCard(data)}
    >
      {props.selected ? selected : null}
      <Rect
        width={width}
        height={height}
        fill={bgColor}
        cornerRadius={cornerRadius}
        shadowBlur={shadowBlur}
        shadowOffsetX={shadowOffsetX}
        shadowOffsetY={shadowOffsetY}
        shadowColor={shadowColor}
      />
      <Text
        x={summaryOffsetX}
        y={summaryOffsetY}
        width={summaryWidth}
        height={summaryHeight}
        padding={summaryPadding}
        fontSize={summaryFontSize}
        fontFamily={summaryFontFamily}
        lineHeight={summaryLineHeight}
        fill={summaryColor}
        text={sanitizedSummary}
      />
      <Text
        x={titleOffsetX}
        y={titleOffsetY}
        width={titleWidth}
        height={titleHeight}
        padding={titlePadding}
        fontSize={titleFontSize}
        fontFamily={titleFontFamily}
        lineHeight={titleLineHeight}
        fill={titleColor}
        text={sanitizedTitle}
      />
    </Group>
  );
}

export default MapCard;
