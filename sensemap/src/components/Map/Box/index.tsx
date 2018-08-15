import * as React from 'react';
import { Group, Rect, Circle } from 'react-konva';
import { TransformerForProps } from '../../Layout';
import Header from './Header';
import Card from './Card';
import Toggle from './Toggle';
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
  selected?: Boolean;
  handleSelect?(data: T.ObjectData): void;
  handleSetDropTarget?(data: T.ObjectData): void;
  handleUnsetDropTarget?(data: T.ObjectData): void;
  handleDeselect?(data: T.ObjectData): void;
  handleDragStart?(e: KonvaEvent.Mouse): void;
  handleDragMove?(e: KonvaEvent.Mouse): void;
  handleDragEnd?(e: KonvaEvent.Mouse): void;
  openBox?(box: T.BoxID): void;
}

type Props = OwnProps & TransformerForProps;

interface State {
  newlySelected: boolean;
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
    const { transform, inverseTransform, box, isDirty = false } = this.props;
    const style = transformObject(transform, Box.style) as typeof Box.style;
    const { x, y, width, height } = transform({
      x: this.props.mapObject.x,
      y: this.props.mapObject.y,
      width: this.props.mapObject.width,
      height: this.props.mapObject.height,
    });
    const cards = Object.values(this.props.cards);
    const { height: cardHeight } = this.props.transform({ height: Card.style.height });
    const { height: toggleHeight } = this.props.transform({ height: Toggle.style.height });
    const selectedWidth = width - style.selected.offset.x * 2;
    const selectedHeight = height - style.selected.offset.y * 2;

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
        x={style.selected.offset.x}
        y={style.selected.offset.y}
        width={selectedWidth}
        height={selectedHeight}
        cornerRadius={style.selected.borderRadius}
        stroke={style.selected.color}
        strokeWidth={style.selected.strokeWidth}
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
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
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
    );
  }
}

export default Box;
