import * as React from 'react';
import { Group, Rect } from 'react-konva';
import Card from './Card';
import Header from './Header';
import * as T from '../../../types';
import * as B from '../../../types/sense/box';
import { noop } from '../../../types/utils';
import { Event as KonvaEvent } from '../../../types/konva';
import * as G from '../../../graphics/point';

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

function boxCards(props: Props) {
  const cards = Object.values(props.cards);
  console.log(cards);
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
  };

  render() {
    const { x, y } = this.props.transform({
      x: this.props.mapObject.x,
      y: this.props.mapObject.y,
    });
    const { box } = this.props;

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
        {boxCards(this.props)}
      </Group>
    );
  }
}

export default Box;
