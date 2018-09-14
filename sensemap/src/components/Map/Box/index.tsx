import * as React from 'react';
import { Group, Rect, Circle } from 'react-konva';
import { LayoutForProps } from '../../Layout';
import { MapObjectForProps } from '../props';
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
  cards: ObjectMap<T.CardData>;
  onSetDropTarget?(e: KonvaEvent.Mouse, o: T.ObjectData): void;
  onUnsetDropTarget?(e: KonvaEvent.Mouse, o: T.ObjectData): void;
}

type Props = OwnProps & LayoutForProps & MapObjectForProps<T.BoxData>;

interface State {
  listDisplay: ListDisplay;
  width: number;
  height: number;
}

const colors = {
  [T.BoxType.NOTE]: { backgroundColor: '#ffdc64', color: '#000000', toggleColor: '#ffffef' },
  [T.BoxType.PROBLEM]: { backgroundColor: '#ffb2be', color: '#000000', toggleColor: '#ffecff' },
  [T.BoxType.SOLUTION]: { backgroundColor: '#9ae0ff', color: '#000000', toggleColor: '#effaff' },
  [T.BoxType.DEFINITION]: { backgroundColor: '#93f8da', color: '#000000', toggleColor: '#defff5' },
  [T.BoxType.INFO]: { backgroundColor: '#484848', color: '#ffffff', toggleColor: '#d1d1d1' },
};

const colorFromType = (boxType: T.BoxType): { backgroundColor: string, color: string, toggleColor: string } =>
  colors[boxType] || { backgroundColor: '#484848', color: '#ffffff', toggleColor: '#d1d1d1' };

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
    margin: {
      bottom: 1,
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
    const { transform, inverseTransform, object, data, isDirty = false } = this.props;
    const { backgroundColor, color, toggleColor } = colorFromType(data.boxType);
    const { height } = this.state;
    const style = transformObject(transform, Box.style) as typeof Box.style;
    let transformed = transform(object);
    const { width } = transformed;
    transformed.width = width;
    transformed.height = height;
    const { left: x, top: y } = D.rectFromBox(transformed);
    const cards = Object.values(this.props.cards);
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
    const onSetDropTarget   = this.props.onSetDropTarget   || noop;
    const onUnsetDropTarget = this.props.onUnsetDropTarget || noop;

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
          onMouseEnter={(e) => onSetDropTarget(e, object)}
          onMouseLeave={(e) => onUnsetDropTarget(e, object)}
          onMouseOver={(e) => onMouseOver(e, object)}
          onMouseOut={(e) => onMouseOut(e, object)}
        >
          {this.props.selected ? selected : null}
          <Header
            transform={transform}
            inverseTransform={inverseTransform}
            box={data}
            width={width}
            backgroundColor={backgroundColor}
            color={color}
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
          <Layout y={height + style.margin.bottom} direction="column">
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
              backgroundColor={backgroundColor}
              color={toggleColor}
              action={this.handleToggleListDisplay}
            />
          </Layout>
        </Group>
      </Selectable>
    );
  }
}

export default Box;
