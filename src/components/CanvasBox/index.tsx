
import * as React from 'react';
import { Group, Rect, Text } from 'react-konva';

interface Props {
  x: number;
  y: number;
}

class Box extends React.Component<Props> {
  render() {
    const {x, y} = this.props;
    const text = "阿....不會吧???嘿!你今天買報紙了沒?快拿出你預藏的安全小剪刀，這個副教授~~~還有臉為人師表嗎?"; // tslint:disable-line
    const width = 100;
    const height = 100;
    return (
      <Group x={x} y={y} draggable={true}>
        <Rect fill="#efefef" width={width} height={height} stroke="#339999" strokeWidth={3} dash={[10, 10]} />
        <Text width={width} height={height} padding={5} text={text} />
      </Group>
    );
  }
}

export default Box;
