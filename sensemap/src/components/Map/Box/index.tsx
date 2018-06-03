import * as React from 'react';
import { Group, Rect } from 'react-konva';
import Header from './Header';
import Card from './Card';
import Toggle from './Toggle';
import * as T from '../../../types';
import * as B from '../../../types/sense/box';
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
  mapObject: T.ObjectData;
  box: T.BoxData;
  cards: T.State['senseObject']['cards'];
  selected?: Boolean;
  transform: G.Transform;
  inverseTransform: G.Transform;
  handleSelect?(data: T.ObjectData): void;
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

const width = B.DEFAULT_WIDTH;
const height = B.DEFAULT_HEIGHT;

const selectedOffsetX = -8;
const selectedOffsetY = -8;
const selectedWidth = width - selectedOffsetY * 2;
const selectedHeight = height - selectedOffsetX * 2;
const selectedCornerRadius = 10;
const selectedColor = '#3ad8fa';
const selectedStrokeWidth = 2;

function boxCards(props: Props, cards: T.CardData[]) {
  const cardHeight = Card.style.height;
  const top = Header.style.height;
  return (
    <Group x={0} y={top}>
      {cards.map((card, i) => <Card card={card} x={0} y={i * cardHeight} key={card.id} />)}
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
    const { x, y } = this.props.transform({
      x: this.props.mapObject.x,
      y: this.props.mapObject.y,
    });
    const { box } = this.props;
    const cards = Object.values(this.props.cards);

    const handleSelect    = this.props.handleSelect    || noop;
    const handleDeselect  = this.props.handleDeselect  || noop;
    const handleDragStart = this.props.handleDragStart || noop;
    const handleDragMove  = this.props.handleDragMove  || noop;
    const handleDragEnd   = this.props.handleDragEnd   || noop;
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
      >
        {this.props.selected ? selected : null}
        <Header box={box} x={0} y={0} />
        {this.state.listDisplay === ListDisplay.COLLAPSED
          ? null : boxCards(this.props, cards)}
        <Toggle
          x={0}
          y={
            Header.style.height
            + (this.state.listDisplay === ListDisplay.COLLAPSED
               ? 0
               : Card.style.height * cards.length
              )
          }
          show={this.state.listDisplay === ListDisplay.EXPANDED}
          action={this.handleToggleListDisplay}
        />
      </Group>
    );
  }
}

export default Box;
