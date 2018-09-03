import * as React from 'react';
import { Group, Rect, Circle } from 'react-konva';
import { TransformerForProps, LayoutForProps } from '../../Layout';
import Layout from '../../Layout';
import Nothing from '../../Layout/Nothing';
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

type Props = OwnProps & LayoutForProps & TransformerForProps;

interface State {
  listDisplay: ListDisplay;
  width: number;
  height: number;
}

function boxCards(
  transform: G.Transform, inverseTransform: G.Transform,
  { width }: { width: number },
  cards: T.CardData[]
) {
  return (
    <Layout direction="column">
      {cards.map(
        (card) =>
          <Card
            key={card.id}
            transform={transform}
            inverseTransform={inverseTransform}
            card={card}
            width={width}
          />
      )}
    </Layout>
  );
}

class Box extends React.PureComponent<Props, State> {

  static style = {
    padding: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    },
    dirty: {
      radius: 5,
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
    width: 0,
    height: 0,
  };

  constructor(props: Props) {
    super(props);
    this.handleToggleListDisplay = this.handleToggleListDisplay.bind(this);
  }

  handleToggleListDisplay() {
    this.setState({ listDisplay: toggleListDisplay(this.state.listDisplay) });
  }

  handleResize = (width: number, height: number): void => {
    const { transform, onResize = noop } = this.props;
    const { padding } = transformObject(transform, Box.style) as typeof Box.style;
    this.setState({ width, height });
    onResize(
      padding.left + width + padding.right,
      padding.top + height + padding.bottom,
    );
  }

  render() {
    const { transform, inverseTransform, box, isDirty = false } = this.props;
    const { height } = this.state;
    const style = transformObject(transform, Box.style) as typeof Box.style;
    let transformed = transform({
      x: this.props.mapObject.x,
      y: this.props.mapObject.y,
      width: this.props.mapObject.width,
      height: this.props.mapObject.height,
      anchor: this.props.mapObject.anchor,
    });
    const { width } = transformed;
    transformed.width = width;
    transformed.height = height;
    const { left: x, top: y } = D.rectFromBox(transformed);
    const cards = Object.values(this.props.cards);
    const selectedWidth = width - style.selected.offset.x * 2;
    const selectedHeight = height - style.selected.offset.y * 2;

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
            width={width}
            onResize={this.handleResize}
          />
          {
            isDirty &&
            <Circle
              x={width - style.padding.left}
              y={style.padding.top}
              radius={style.dirty.radius}
              fill={style.dirty.color}
            />
          }
          <Layout y={height} direction="column">
            {
              this.state.listDisplay === ListDisplay.COLLAPSED
                ? <Nothing />
                : boxCards(transform, inverseTransform, { width }, cards)
            }
            <Toggle
              disabled={cards.length === 0}
              transform={transform}
              inverseTransform={inverseTransform}
              width={width}
              show={this.state.listDisplay === ListDisplay.EXPANDED}
              action={this.handleToggleListDisplay}
            />
          </Layout>
        </Group>
      </Selectable>
    );
  }
}

export default Box;
