import * as React from 'react';
import { Group, Rect, Circle } from 'react-konva';
import { TransformerForProps } from '../../Layout';
import Selectable from '../../Layout/Selectable';
import Header from './Header';
import Card from './Card';
import Toggle from './Toggle';
import * as D from '../../../graphics/drawing';
import * as T from '../../../types';
import { ObjectMap } from '../../../types/sense/has-id';
import * as G from '../../../graphics/point';
import { transformObject } from '../../../types/viewport';
import { noop } from '../../../types/utils';
import { Event as KonvaEvent } from '../../../types/konva';

export enum ListDisplay {
  EXPANDED  = 'EXPANDED',
  COLLAPSED = 'COLLAPSED',
}

const toggleListDisplay = (d: ListDisplay) =>
  d === ListDisplay.EXPANDED ? ListDisplay.COLLAPSED : ListDisplay.EXPANDED;

interface OwnProps {
  isDirty?: boolean;
  mapObject: T.ObjectData;
  box: T.BoxData;
  cards: ObjectMap<T.CardData>;
  selected?: boolean;
  handleSelect?(data: T.ObjectData): void;
  handleSetDropTarget?(data: T.ObjectData): void;
  handleUnsetDropTarget?(data: T.ObjectData): void;
  handleDeselect?(data: T.ObjectData): void;
  handleDragStart?(e: KonvaEvent.Mouse): void;
  handleDragMove?(e: KonvaEvent.Mouse): void;
  handleDragEnd?(e: KonvaEvent.Mouse): void;
  handleTouchStart?(e: KonvaEvent.Touch): void;
  handleTouchMove?(e: KonvaEvent.Touch): void;
  handleTouchEnd?(e: KonvaEvent.Touch): void;
  openBox?(box: T.BoxID): void;
}

type Props = OwnProps & TransformerForProps;

interface State {
  listDisplay: ListDisplay;
}

function boxCards(
  transform: G.Transform, inverseTransform: G.Transform,
  { cardHeight, width, height }: { cardHeight: number, width: number, height: number },
  cards: T.CardData[]
) {
  const top = height;
  return (
    <Group x={0} y={top}>
      {cards.map(
        (card, i) =>
          <Card
            transform={transform}
            inverseTransform={inverseTransform}
            card={card}
            x={0}
            y={i * cardHeight}
            width={width}
            height={cardHeight}
            key={card.id}
          />
      )}
    </Group>
  );
}

class Box extends React.Component<Props, State> {
  static style = {
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
    selected: {
      offset: { x: -8, y: -8 },
      borderRadius: 10,
      color: '#3ad8fa',
      strokeWidth: 2,
    },
  };

  state = {
    listDisplay: ListDisplay.COLLAPSED,
  };

  constructor(props: Props) {
    super(props);
    this.handleToggleListDisplay = this.handleToggleListDisplay.bind(this);
  }

  handleToggleListDisplay() {
    this.setState({ listDisplay: toggleListDisplay(this.state.listDisplay) });
  }

  render() {
    const { transform, inverseTransform, box, isDirty = false } = this.props;
    const style = transformObject(transform, Box.style) as typeof Box.style;
    const transformed = transform({
      x: this.props.mapObject.x,
      y: this.props.mapObject.y,
      width: this.props.mapObject.width,
      height: this.props.mapObject.height,
      anchor: this.props.mapObject.anchor,
    });
    const { width, height } = transformed;
    const { left: x, top: y } = D.rectFromBox(transformed);
    const cards = Object.values(this.props.cards);
    const { height: cardHeight } = this.props.transform({ height: Card.style.height });
    const { height: toggleHeight } = this.props.transform({ height: Toggle.style.height });
    const selectedWidth = transformed.width - style.selected.offset.x * 2;
    const selectedHeight = transformed.height - style.selected.offset.y * 2;

    const handleSelect     = this.props.handleSelect     || noop;
    const handleDeselect   = this.props.handleDeselect   || noop;
    const handleDragStart  = this.props.handleDragStart  || noop;
    const handleDragMove   = this.props.handleDragMove   || noop;
    const handleDragEnd    = this.props.handleDragEnd    || noop;
    const handleTouchStart = this.props.handleTouchStart || noop;
    const handleTouchMove  = this.props.handleTouchMove  || noop;
    const handleTouchEnd   = this.props.handleTouchEnd   || noop;
    const handleSetDropTarget   = this.props.handleSetDropTarget   || noop;
    const handleUnsetDropTarget = this.props.handleUnsetDropTarget || noop;
    const openBox         = this.props.openBox         || noop;

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
            openBox(box.id);
          }}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={handleSetDropTarget}
          onMouseLeave={handleUnsetDropTarget}
        >
          {this.props.selected ? selected : null}
          <Header
            transform={transform}
            inverseTransform={inverseTransform}
            box={box}
            x={0}
            y={0}
            width={width}
            height={height}
          />
          {
            isDirty &&
            <Circle
              x={width - style.dirty.padding.left}
              y={style.dirty.padding.top}
              radius={style.dirty.radius}
              fill={style.dirty.color}
            />
          }
          {this.state.listDisplay === ListDisplay.COLLAPSED
            ? null : boxCards(transform, inverseTransform, { cardHeight, width, height }, cards)}
          <Toggle
            transform={transform}
            inverseTransform={inverseTransform}
            x={0}
            y={
              height
              + (this.state.listDisplay === ListDisplay.COLLAPSED
                ? 0
                : cardHeight * cards.length
                )
            }
            width={width}
            height={toggleHeight}
            show={this.state.listDisplay === ListDisplay.EXPANDED}
            action={this.handleToggleListDisplay}
          />
        </Group>
      </Selectable>
    );
  }
}

export default Box;
