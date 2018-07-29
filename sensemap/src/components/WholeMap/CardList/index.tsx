import * as React from 'react';
import { Group, Rect } from 'react-konva';
import { TransformerForProps } from '../';
import { ObjectData, CardData } from '../../../types';
import { transformObject } from '../../../types/viewport';
import TextList from '../../Layout/TextList';

interface OwnProps {
  mapObject: ObjectData;
  x?: number;
  y?: number;
  cards: CardData[];
}

interface OwnState {
  height: number;
}

type Props = OwnProps & TransformerForProps;

class CardList extends React.PureComponent<Props, OwnState> {
  static style = {
    backgroundColor: '#b3e5fc',
    borderRadius: 18,
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
    const { height: textHeight } = this.state;
    const height = textHeight + style.padding.top + style.padding.bottom;
    const cardTexts = cards.map(c => c.summary || c.title);

    return (
      <Group x={x + style.margin.left} y={y}>
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
      </Group>
    );
  }
}

export default CardList;