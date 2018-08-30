import * as React from 'react';
import { Group, Rect, Circle, Text } from 'react-konva';
import { TransformerForProps } from '../../Layout';
import Selectable from '../../Layout/Selectable';
import TagList from '../TagList';
import * as D from '../../../graphics/drawing';
import * as T from '../../../types';
import { transformObject } from '../../../types/viewport';
import { noop, toTags } from '../../../types/utils';
import { Event as KonvaEvent } from '../../../types/konva';

interface OwnProps {
  isDirty?: boolean;
  mapObject: T.ObjectData;
  card: T.CardData;
  selected?: boolean;
  handleSelect?(object: T.ObjectData): void;
  handleDeselect?(object: T.ObjectData): void;
  handleDragStart?(e: KonvaEvent.Mouse): void;
  handleDragMove?(e: KonvaEvent.Mouse): void;
  handleDragEnd?(e: KonvaEvent.Mouse): void;
  handleTouchStart?(e: KonvaEvent.Touch): void;
  handleTouchMove?(e: KonvaEvent.Touch): void;
  handleTouchEnd?(e: KonvaEvent.Touch): void;
  openCard?(id: T.CardID): void;
}

type Props = OwnProps & TransformerForProps;

interface State {
  tagHeight: number;
}

const color = {
  [T.CardType.NORMAL]: 'rgba(255, 255, 255, 1)',
  [T.CardType.NOTE]: 'rgba(255, 227, 132, 1)',
  [T.CardType.QUESTION]: 'rgba(255, 236, 239, 1)',
  [T.CardType.ANSWER]: 'rgba(222, 255, 245, 1)'
};

const colorFromType = (cardType: T.CardType): string =>
  color[cardType] || 'rgba(255, 255, 255, 1)';

const summaryLimit = 39;
const descriptionLimit = 64;

class Card extends React.Component<Props, State> {
  static style = {
    borderRadius: 4,
    dirty: {
      radius: 5,
      padding: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
      },
      color: '#3ad8fa',
    },
    description: {
      padding: {
        top: 12 + 22 * 3,
        right: 10,
        bottom: 0,
        left: 10,
      },
      fontFamily: 'sans-serif',
      fontSize: 13,
      lineHeight: 20 / 13,
      height: 64,
      color: '#5a5a5a',
    },
    summary: {
      padding: {
        top: 8,
        right: 10,
        bottom: 8,
        left: 10,
      },
      fontFamily: 'sans-serif',
      fontSize: 16,
      lineHeight: 32 / 16,
      height: 22 * 3,
      color: '#000000',
    },
    shadow: {
      blur: 10,
      color: '#999',
      offset: { x: 2, y: 3 },
    },
    selected: {
      offset: { x: -6, y: -6 },
      borderRadius: 8,
      color: '#3ad8fa',
      strokeWidth: 3,
    },
    tag: {
      margin: {
        top: 8,
        right: 8,
        bottom: 8,
        left: 8,
      },
    },
  };

  state = {
    tagHeight: 0,
  };

  render() {
    const { transform, inverseTransform, isDirty = false } = this.props;
    const style = transformObject(transform, Card.style) as typeof Card.style;
    const { data } = this.props.mapObject;
    const transformed = this.props.transform({
      x: this.props.mapObject.x,
      y: this.props.mapObject.y,
      width: this.props.mapObject.width,
      height: this.props.mapObject.height,
    });
    const { width, height } = transformed;
    const { left: x, top: y } = D.rectFromBox(transformed);
    const {summary, description, cardType, tags} = this.props.card;
    const sanitizedSummary = summary.substr(0, summaryLimit);
    const sanitizedDescription   = description.substr(0, descriptionLimit);
    const tagHeight = this.state.tagHeight;
    const selectedWidth = width - style.selected.offset.x * 2;
    const selectedHeight = height - style.selected.offset.y * 2;
    const summaryWidth = width - style.summary.padding.left - style.summary.padding.right;
    const descriptionWidth = width - style.description.padding.left - style.description.padding.right;

    const handleSelect     = this.props.handleSelect     || noop;
    const handleDeselect   = this.props.handleDeselect   || noop;
    const handleDragStart  = this.props.handleDragStart  || noop;
    const handleDragMove   = this.props.handleDragMove   || noop;
    const handleDragEnd    = this.props.handleDragEnd    || noop;
    const handleTouchStart = this.props.handleTouchStart || noop;
    const handleTouchMove  = this.props.handleTouchMove  || noop;
    const handleTouchEnd   = this.props.handleTouchEnd   || noop;
    const openCard         = this.props.openCard         || noop;
    const bgColor          = colorFromType(cardType);

    const selected = (
      <Rect
        x={style.selected.offset.x}
        y={style.selected.offset.y}
        width={selectedWidth}
        height={selectedHeight}
        cornerRadius={style.selected.borderRadius}
        stroke={style.selected.color}
        strokeWidth={style.selected.strokeWidth}
      />);

    return (
      <Selectable
        selected={this.props.selected}
        onSelect={(e) => {
          e.cancelBubble = true;
          handleSelect(this.props.mapObject);
        }}
        onDeselect={(e) => {
          e.cancelBubble = true;
          handleDeselect(this.props.mapObject);
        }}
      >
        <Group
          x={x}
          y={y}
          draggable={true}
          onDblClick={() => {
            handleSelect(this.props.mapObject);
            openCard(data);
          }}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {this.props.selected ? selected : null}
          <Rect
            width={width}
            height={height}
            fill={bgColor}
            cornerRadius={style.borderRadius}
            shadowBlur={style.shadow.blur}
            shadowOffsetX={style.shadow.offset.x}
            shadowOffsetY={style.shadow.offset.y}
            shadowColor={style.shadow.color}
          />
          {
            isDirty &&
            <Circle
              x={width - style.dirty.padding.right}
              y={style.dirty.padding.top}
              radius={style.dirty.radius}
              fill={style.dirty.color}
            />
          }
          <Text
            x={style.summary.padding.left}
            y={style.summary.padding.top}
            width={summaryWidth}
            height={style.summary.height}
            padding={style.summary.padding.left}
            fontSize={style.summary.fontSize}
            fontFamily={style.summary.fontFamily}
            lineHeight={style.summary.lineHeight}
            fill={style.summary.color}
            text={sanitizedSummary}
          />
          <Text
            x={style.description.padding.left}
            y={style.description.padding.top}
            width={descriptionWidth}
            height={style.description.height}
            padding={style.description.padding.left}
            fontSize={style.description.fontSize}
            fontFamily={style.description.fontFamily}
            lineHeight={style.description.lineHeight}
            fill={style.description.color}
            text={sanitizedDescription}
          />
          <TagList
            transform={transform}
            inverseTransform={inverseTransform}
            x={style.tag.margin.left}
            y={height - style.tag.margin.bottom - tagHeight}
            width={width - style.tag.margin.left - style.tag.margin.right}
            tags={toTags(tags)}
            onResize={(w, h) => this.setState({ tagHeight: h })}
          />
        </Group>
      </Selectable>
    );
  }
}

export default Card;
