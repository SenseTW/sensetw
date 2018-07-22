import * as React from 'react';
import { Group, Rect, Circle } from 'react-konva';
import Header from './Header';
import Card from './Card';
import Toggle from './Toggle';
import * as T from '../../../types';
import { ObjectMap } from '../../../types/sense/has-id';
import { noop } from '../../../types/utils';
import { Event as KonvaEvent } from '../../../types/konva';
import * as G from '../../../graphics/point';

export enum ListDisplay {
  EXPANDED  = 'EXPANDED',
  COLLAPSED = 'COLLAPSED',
}

const toggleListDisplay = (d: ListDisplay) =>
  d === ListDisplay.EXPANDED ? ListDisplay.COLLAPSED : ListDisplay.EXPANDED;

interface Props {
  isDirty?: boolean;
  mapObject: T.ObjectData;
  box: T.BoxData;
  cards: ObjectMap<T.CardData>;
  selected?: Boolean;
  transform: G.Transform;
  inverseTransform: G.Transform;
  handleSelect?(data: T.ObjectData): void;
  handleSetDropTarget?(data: T.ObjectData): void;
  handleUnsetDropTarget?(data: T.ObjectData): void;
  handleDeselect?(data: T.ObjectData): void;
  handleDragStart?(e: KonvaEvent.Mouse): void;
  handleDragMove?(e: KonvaEvent.Mouse): void;
  handleDragEnd?(e: KonvaEvent.Mouse): void;
  openBox?(box: T.BoxID): void;
}

interface State {
  newlySelected: boolean;
  listDisplay: ListDisplay;
}

const dirtyRadius = 5;
const dirtyPadding = 10;
const dirtyColor = '#3ad8fa';

const selectedOffsetX = -8;
const selectedOffsetY = -8;
const selectedCornerRadius = 10;
const selectedColor = '#3ad8fa';
const selectedStrokeWidth = 2;

function boxCards(
  { cardHeight, width, height }: { cardHeight: number, width: number, height: number },
  cards: T.CardData[]
) {
  const top = height;
  return (
    <Group x={0} y={top}>
      {cards.map(
        (card, i) =>
          <Card card={card} x={0} y={i * cardHeight} width={width} height={cardHeight} key={card.id} />
      )}
    </Group>
  );
}

class Box extends React.Component<Props, State> {
  state = {
    newlySelected: false,
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
    const { x, y, width, height } = this.props.transform({
      x: this.props.mapObject.x,
      y: this.props.mapObject.y,
      width: this.props.mapObject.width,
      height: this.props.mapObject.height,
    });
    const { box, isDirty = false } = this.props;
    const cards = Object.values(this.props.cards);
    const { height: cardHeight } = this.props.transform({ height: Card.style.height });
    const { height: toggleHeight } = this.props.transform({ height: Toggle.style.height });
    const selectedWidth = width - selectedOffsetX * 2;
    const selectedHeight = height - selectedOffsetY * 2;

    const handleSelect    = this.props.handleSelect    || noop;
    const handleDeselect  = this.props.handleDeselect  || noop;
    const handleDragStart = this.props.handleDragStart || noop;
    const handleDragMove  = this.props.handleDragMove  || noop;
    const handleDragEnd   = this.props.handleDragEnd   || noop;
    const handleSetDropTarget   = this.props.handleSetDropTarget   || noop;
    const handleUnsetDropTarget = this.props.handleUnsetDropTarget || noop;
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

    return (
      <Group
        x={x}
        y={y}
        draggable={true}
        onMouseDown={(e) => {
          e.cancelBubble = true;
          if (this.props.selected) {
            return;
          }
          this.setState({ newlySelected: true });
          handleSelect(this.props.mapObject);
        }}
        onClick={(e) => {
          e.cancelBubble = true;
          if (!this.state.newlySelected) {
            handleDeselect(this.props.mapObject);
          }
          this.setState({ newlySelected: false });
        }}
        onDblClick={() => {
          handleSelect(this.props.mapObject);
          openBox(box.id);
        }}
        onMouseUp={(e) => {
          e.cancelBubble = true;
        }}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onMouseEnter={handleSetDropTarget}
        onMouseLeave={handleUnsetDropTarget}
      >
        {this.props.selected ? selected : null}
        <Header box={box} x={0} y={0} width={width} height={height} />
        {
          isDirty &&
          <Circle
            x={width - dirtyPadding}
            y={dirtyPadding}
            radius={dirtyRadius}
            fill={dirtyColor}
          />
        }
        {this.state.listDisplay === ListDisplay.COLLAPSED
          ? null : boxCards({ cardHeight, width, height }, cards)}
        <Toggle
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
    );
  }
}

export default Box;
