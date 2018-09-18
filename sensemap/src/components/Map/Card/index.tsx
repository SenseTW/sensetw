import * as React from 'react';
import { Group, Rect, Circle } from 'react-konva';
import Layout from '../../Layout';
import { MapObjectForProps } from '../props';
import Text from '../../Layout/Text';
import Creator from '../Creator';
import Selectable from '../../Layout/Selectable';
import TagList from '../TagList';
import * as D from '../../../graphics/drawing';
import * as T from '../../../types';
import { transformObject } from '../../../types/viewport';
import { noop, toTags } from '../../../types/utils';

type Props = MapObjectForProps<T.CardData>;

interface State {
  containerWidth: number;
  containerHeight: number;
}

const color = {
  // legacy card types
  [T.CardType.NORMAL]: 'rgba(255, 255, 255, 1)',
  [T.CardType.QUESTION]: 'rgba(255, 236, 239, 1)',
  [T.CardType.ANSWER]: 'rgba(222, 255, 245, 1)',
  // card types
  [T.CardType.NOTE]: '#ffffef',
  [T.CardType.PROBLEM]: '#ffecef',
  [T.CardType.SOLUTION]: '#effaff',
  [T.CardType.DEFINITION]: '#defff5',
  [T.CardType.INFO]: '#ffffff',
};

const colorFromType = (cardType: T.CardType): string =>
  color[cardType] || '#ffffff';

const summaryLimit = Infinity;
const descriptionLimit = Infinity;

class Card extends React.PureComponent<Props, State> {
  static style = {
    borderRadius: 4,
    padding: {
      top: 8,
      right: 10,
      bottom: 8,
      left: 10,
    },
    textGap: 10,
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
      fontFamily: 'sans-serif',
      fontSize: 13,
      lineHeight: 20 / 13,
      color: '#5a5a5a',
    },
    summary: {
      fontFamily: 'sans-serif',
      fontSize: 16,
      lineHeight: 24 / 16,
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
  };

  state = {
    containerWidth: 0,
    containerHeight: 0,
  };

  handleContainerResize = (containerWidth: number, containerHeight: number): void => {
    this.setState({ containerWidth, containerHeight });
  }

  render() {
    const { transform, inverseTransform, object, data, isDirty = false } = this.props;
    const { containerHeight } = this.state;
    const style = transformObject(transform, Card.style) as typeof Card.style;
    let transformed = this.props.transform(object);
    const { width } = transformed;
    const height = style.padding.top + containerHeight + style.padding.bottom;
    const textWidth = width - style.padding.left - style.padding.right;
    transformed.width = width;
    transformed.height = height;
    const { left: x, top: y } = D.rectFromBox(transformed);
    const {summary, description, cardType, tags} = data;
    const sanitizedSummary = summary.substr(0, summaryLimit);
    const sanitizedDescription   = description.substr(0, descriptionLimit);
    const selectedWidth = width - style.selected.offset.x * 2;
    const selectedHeight = height - style.selected.offset.y * 2;

    const onSelect     = this.props.onSelect     || noop;
    const onDeselect   = this.props.onDeselect   || noop;
    const onDragStart  = this.props.onDragStart  || noop;
    const onDragMove   = this.props.onDragMove   || noop;
    const onDragEnd    = this.props.onDragEnd    || noop;
    const onTouchStart = this.props.onTouchStart || noop;
    const onTouchMove  = this.props.onTouchMove  || noop;
    const onTouchEnd   = this.props.onTouchEnd   || noop;
    const onMouseOver  = this.props.onMouseOver  || noop;
    const onMouseOut   = this.props.onMouseOut   || noop;
    const onOpen       = this.props.onOpen       || noop;
    const bgColor      = colorFromType(cardType);

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
          onSelect(e, object);
        }}
        onDeselect={(e) => {
          e.cancelBubble = true;
          onDeselect(e, object);
        }}
      >
        <Group
          x={x}
          y={y}
          draggable={true}
          onDblClick={(e) => {
            onSelect(e, object);
            onOpen(e, data.id);
          }}
          onDragStart={(e) => onDragStart(e, object)}
          onDragMove={(e) => onDragMove(e, object)}
          onDragEnd={(e) => onDragEnd(e, object)}
          onTouchStart={(e) => onTouchStart(e, object)}
          onTouchMove={(e) => onTouchMove(e, object)}
          onTouchEnd={(e) => onTouchEnd(e, object)}
          onMouseOver={(e) => onMouseOver(e, object)}
          onMouseOut={(e) => onMouseOut(e, object)}
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
          <Layout
            direction="column"
            x={style.padding.left}
            y={style.padding.top}
            margin={style.textGap}
            onResize={this.handleContainerResize}
          >
            <Creator
              transform={transform}
              inverseTransform={inverseTransform}
              width={textWidth}
              name={data.owner.username}
              time={data.createdAt}
            />
            {
              sanitizedSummary.length === 0
                ? null
                : (
                  <Text
                    width={textWidth}
                    fontSize={style.summary.fontSize}
                    fontFamily={style.summary.fontFamily}
                    lineHeight={style.summary.lineHeight}
                    fill={style.summary.color}
                    text={sanitizedSummary}
                  />
                )
            }
            {
              sanitizedDescription.length === 0
                ? null
                : (
                  <Text
                    width={textWidth}
                    fontSize={style.description.fontSize}
                    fontFamily={style.description.fontFamily}
                    lineHeight={style.description.lineHeight}
                    fill={style.description.color}
                    text={sanitizedDescription}
                  />
                )
            }
            {
              tags.length === 0
                ? null
                : (
                  <TagList
                    transform={transform}
                    inverseTransform={inverseTransform}
                    width={textWidth}
                    tags={toTags(tags)}
                  />
                )
            }
          </Layout>
        </Group>
      </Selectable>
    );
  }
}

export default Card;
