
import * as React from 'react';
import { Group, Rect, Text } from 'react-konva';

interface Props {
  x: number;
  y: number;
}

class Card extends React.Component<Props> {
  render() {
    const {x, y} = this.props;
    const width = 120;
    const height = 120;
    const text = "缺乏基礎研發人才沒有紮實的底層知識／掌握關鍵技術。有瘦肉精，尼克大勝12分，節目抹黑我國臺灣鯛形象，泰美女總理盈拉，自家賣熱狗麵包，AV版《神鬼奇航》，裸少年抓青蛙雕像被嫌礙眼，我相信我此生都不會跟他們有交集的...一定不會有的，....你知道事情的嚴重性嗎?"; // tslint:disable-line
    return (
      <Group draggable={true} x={x} y={y}>
        <Rect width={width} height={height} fill="#ff6666" />
        <Text padding={5} width={width} height={height} align="center" text={text} />
      </Group>
    );
  }
}

export default Card;
