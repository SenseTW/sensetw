import * as React from 'react';
import { Text as TextNode } from 'konva';
import { Group, Rect, Text } from 'react-konva';

const tagPadding = 4;
const tagBackground = '#d8d8d8';
const tagColor = '#000000';
const tagRadius = 4;
const tagFontSize = 14;

interface Props {
  x: number;
  y: number;
  text: string;
  onResize?(width: number, height: number): void;
}

interface State {
  w: number;
  h: number;
}

class MapTag extends React.Component<Props, State> {
  state = {
    w: 0,
    h: 0,
  };

  textNode: TextNode | null = null;

  componentDidMount() {
    if (!this.textNode) {
      return;
    }

    const w = this.textNode.getWidth();
    const h = this.textNode.getHeight();
    this.setState({ w, h });

    const { onResize } = this.props;
    if (onResize) {
      onResize(w, h);
    }
  }

  render() {
    const { x, y, text } = this.props;
    const { w, h } = this.state;

    return (
      <Group
        x={x}
        y={y}
      >
        <Rect
          width={w + 2 * tagPadding}
          height={h + 2 * tagPadding}
          fill={tagBackground}
          cornerRadius={tagRadius}
        />
        <Text
          // force the reference node to be a Konva Text
          // tslint:disable-next-line:no-any
          ref={(node: any) => this.textNode = node}
          x={tagPadding}
          y={tagPadding}
          fontSize={tagFontSize}
          fill={tagColor}
          text={text}
        />
      </Group>
    );
  }
}

export default MapTag;
