import * as React from 'react';
import { Group, Rect } from 'react-konva';
import { TransformerForProps } from '../../Layout';
import { ObjectData, CardData } from '../../../types';
import Caret from '../../Layout/Caret';
import Text from '../../Layout/Text';
import TextList from '../../Layout/TextList';
import { SQRT3 } from '../../../types/utils';

interface OwnProps {
  mapObject: ObjectData;
  x?: number;
  y?: number;
  title: string;
  cards: CardData[];
}

enum Direction {
  BOTTOM_RIGHT = 'bottom right',
  BOTTOM_LEFT = 'bottom left',
  TOP_RIGHT = 'top right',
  TOP_LEFT = 'top left',
}

interface OwnState {
  titleHeight: number;
  textHeight: number;
  direction: Direction;
}

type Props = OwnProps & TransformerForProps;

class CardList extends React.PureComponent<Props, OwnState> {
  static style = {
    backgroundColor: '#b3e5fc',
    borderRadius: 6,
    caret: {
      offset: {
        x: 1,
        y: 4,
      },
      height: 8,
      base: SQRT3 / 3 * 2 * 8,
    },
    title: {
      fontSize: 24,
      margin: {
        bottom: 16,
      },
    },
    color: '#000',
    fontSize: 16,
    lineHeight: 1.2,
    width: 200,
    margin: {
      left: 12,
    },
    padding: {
      top: 6,
      right: 6,
      bottom: 6,
      left: 6,
    },
    textGap: 10,
  };

  state = {
    titleHeight: 0,
    textHeight: 0,
    direction: Direction.BOTTOM_RIGHT,
  };

  handleTitleResize = (width: number, height: number) => {
    this.setState({ titleHeight: height });
  }

  handleTextResize = (width: number, height: number) => {
    this.setState({ textHeight: height });
  }

  render() {
    const { transform, title, cards } = this.props;
    // use the untransformed style
    const style = CardList.style;
    const width = style.width;
    const { x, y } = transform({
      x: this.props.x,
      y: this.props.y,
    });
    const textWidth = style.width - style.padding.left - style.padding.right;
    const fontSize = style.fontSize;
    const { titleHeight, textHeight, direction } = this.state;
    const height =
      style.padding.top +
      titleHeight +
      (cards.length === 0 ? 0 : style.title.margin.bottom) +
      (cards.length === 0 ? 0 : textHeight - style.textGap) +
      style.padding.bottom;
    // card summary and description are more important than the title
    const cardTexts = cards.map(c => c.summary || c.title);

    const renderedText = (
      <React.Fragment>
        <Rect
          width={width}
          height={height}
          cornerRadius={style.borderRadius}
          fill={style.backgroundColor}
        />
        <Text
          x={style.padding.left}
          y={style.padding.top}
          width={textWidth}
          fontSize={style.title.fontSize}
          lineHeight={style.lineHeight}
          text={title}
          onResize={this.handleTitleResize}
        />
        {
          cards.length !== 0 &&
          <TextList
            x={style.padding.left}
            y={style.padding.top + titleHeight + style.title.margin.bottom}
            width={textWidth}
            fontSize={fontSize}
            lineHeight={style.lineHeight}
            margin={style.textGap}
            texts={cardTexts}
            onResize={this.handleTextResize}
          />
        }
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
              base={CardList.style.caret.base}
              height={CardList.style.caret.height}
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