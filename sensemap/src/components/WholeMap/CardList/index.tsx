import * as React from 'react';
import { Path, Group, Rect } from 'react-konva';
import { TransformerForProps } from '../';
import { ObjectData, CardData } from '../../../types';
import { transformObject } from '../../../types/viewport';
import TextList from '../../Layout/TextList';

interface CaretProps {
  top?: boolean;
  right?: boolean;
  bottom?: boolean;
  left?: boolean;
  x?: number;
  y?: number;
  base?: number;
  height?: number;
  fill: string;
}

class Caret extends React.PureComponent<CaretProps> {
  render() {
    let { top } = this.props;
    const {
      right,
      bottom,
      left,
      x = 0,
      y = 0,
      base = 0,
      height = 0,
      fill,
    } = this.props;
    if (!top && !right && !left && !bottom) { top = true; }

    if (base <= 0 || height <= 0) { return null; }

    if (top) {
      return (
        <Path
           x={x}
           y={y}
           data={`M${0} ${-height} L${base / 2} ${0} h${-base} L${0}, ${-height}z`}
           fill={fill}
        />
      );
    } else if (right) {
      return (
        <Path
           x={x}
           y={y}
           data={`M${height} ${0} L${0} ${base / 2} v${-base} L${height} ${0}z`}
           fill={fill}
        />
      );
    } else if (bottom) {
      return (
        <Path
           x={x}
           y={y}
           data={`M${0} ${height} L${-base / 2} ${0} h${base} L${0} ${height}z`}
           fill={fill}
        />
      );
    } else if (left) {
      return (
        <Path
           x={x}
           y={y}
           data={`M${-height} ${0} L${0} ${-base / 2} v${base} L${-height} ${0}z`}
           fill={fill}
        />
      );
    } else {
      return null as never;
    }
  }
}

interface OwnProps {
  mapObject: ObjectData;
  x?: number;
  y?: number;
  cards: CardData[];
}

enum Direction {
  BOTTOM_RIGHT = 'bottom right',
  BOTTOM_LEFT = 'bottom left',
  TOP_RIGHT = 'top right',
  TOP_LEFT = 'top left',
}

interface OwnState {
  height: number;
  direction: Direction;
}

type Props = OwnProps & TransformerForProps;

class CardList extends React.PureComponent<Props, OwnState> {
  static style = {
    backgroundColor: '#b3e5fc',
    borderRadius: 18,
    caret: {
      offset: {
        x: 1,
        y: 12,
      },
      height: 24,
      base: 24 * Math.sqrt(1 / 3) * 2,
    },
    color: '#000',
    fontSize: 36,
    width: 630,
    margin: {
      left: 36,
    },
    padding: {
      top: 18,
      right: 48,
      bottom: 18,
      left: 18,
    },
    textGap: 30,
  };

  state = {
    height: 0,
    direction: Direction.BOTTOM_RIGHT,
  };

  handleResize = (width: number, height: number) => {
    this.setState({ height });
  }

  render() {
    const { transform, cards } = this.props;
    const style = transformObject(transform, CardList.style) as typeof CardList.style;
    const { x, y, width } = transform({
      x: this.props.x,
      y: this.props.y,
      width: CardList.style.width,
    });
    const textWidth = width - style.padding.left - style.padding.right;
    const { height: textHeight, direction } = this.state;
    const height = textHeight + style.padding.top + style.padding.bottom;
    const cardTexts = cards.map(c => c.summary || c.title);

    const renderedText = (
      <React.Fragment>
        <Rect
          width={width}
          height={height}
          cornerRadius={style.borderRadius}
          fill={style.backgroundColor}
        />
        <TextList
          x={style.padding.left}
          y={style.padding.top}
          width={textWidth}
          fontSize={style.fontSize}
          margin={style.textGap}
          texts={cardTexts}
          onResize={this.handleResize}
        />
      </React.Fragment>
    );

    switch (direction) {
      case Direction.BOTTOM_RIGHT:
        return (
          <Group x={x + style.margin.left} y={y}>
            <Caret
              left
              x={style.caret.offset.x}
              y={style.caret.offset.y + style.caret.base / 2}
              base={style.caret.base}
              height={style.caret.height}
              fill={style.backgroundColor}
            />
            {renderedText}
          </Group>
        );
      case Direction.BOTTOM_LEFT:
        return (
          <Group x={x - width - style.margin.left} y={y}>
            <Caret
              right
              x={width - style.caret.offset.x}
              y={style.caret.offset.y + style.caret.base / 2}
              base={style.caret.base}
              height={style.caret.height}
              fill={style.backgroundColor}
            />
            {renderedText}
          </Group>
        );
      case Direction.TOP_RIGHT:
        return (
          <Group x={x + style.margin.left} y={y - height}>
            <Caret
              left
              x={style.caret.offset.x}
              y={height - style.caret.offset.y - style.caret.base / 2}
              base={style.caret.base}
              height={style.caret.height}
              fill={style.backgroundColor}
            />
            {renderedText}
          </Group>
        );
      case Direction.TOP_LEFT:
        return (
          <Group x={x - width - style.margin.left} y={y - height}>
            <Caret
              right
              x={width - style.caret.offset.x}
              y={height - style.caret.offset.y - style.caret.base / 2}
              base={style.caret.base}
              height={style.caret.height}
              fill={style.backgroundColor}
            />
            {renderedText}
          </Group>
        );
      default:
        return null as never;
    }
  }
}

export default CardList;