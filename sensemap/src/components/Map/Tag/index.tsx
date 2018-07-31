import * as React from 'react';
import { Text as TextNode } from 'konva';
import { Group, Rect, Text } from 'react-konva';
import { noop } from '../../../types/utils';

const tagPadding = 4;
const tagBackground = '#d8d8d8';
const tagColor = '#000000';
const tagRadius = 4;
const tagFontSize = 14;

interface Props {
  x?: number;
  y?: number;
  width: number;
  height: number;
  text: string;
  onResize?(width: number, height: number): void;
  onFail?(text: string): void;
}

interface State {
  index: number;
  w: number;
  h: number;
}

/**
 * Tag will render its text under the given width and height. If it fails to do
 * so, it will slice its content and try again. If any attempts are failed, it
 * will call the `onFail` method and render nothing.
 */
class Tag extends React.Component<Props, State> {
  textNode: TextNode | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      index: this.props.text.length,
      w: 0,
      h: 0,
    };
  }

  updateDimension() {
    if (!this.textNode) {
      return;
    }

    const { width = 0, height = 0 } = this.props;

    const w = this.textNode.getWidth();
    const h = this.textNode.getHeight();
    const tagWidth = w + 2 * tagPadding;
    const tagHeight = h + 2 * tagPadding;
    const { text, onResize = noop, onFail = noop } = this.props;
    const { index } = this.state;

    if (index === 0) {
      onResize(0, 0);
      onFail(text);
      return;
    }

    if (tagHeight > height) {
      this.setState({ index: 0, w: 0, h: 0 });
      return;
    }

    if (tagWidth > width) {
      this.setState({ index: this.state.index - 1, w, h });
    } else {
      this.setState({ w, h });
    }

    onResize(w + 2 * tagPadding, h + 2 * tagPadding);
  }

  componentDidMount() {
    this.updateDimension();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { x: prevX = 0, y: prevY = 0, width: prevWidth = 0, height: prevHeight = 0, text: prevText } = prevProps;
    const { x = 0, y = 0, width = 0, height = 0, text } = this.props;
    const { index } = this.state;

    if (text !== prevText) {
      this.setState({ index: text.length });
    }

    if (
      x !== prevX || y !== prevY ||
      width !== prevWidth || height !== prevHeight ||
      text !== prevText ||
      index !== prevState.index
    ) {
      this.updateDimension();
    }
  }

  render() {
    const { x = 0, y = 0, text } = this.props;
    const { index, w, h } = this.state;

    if (index === 0) {
      return false;
    }

    let slicedText = index === text.length
      ? text
      : text.slice(0, index);
    if (slicedText.length && slicedText.length !== text.length) {
      slicedText += '…';
    }

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
          text={slicedText}
        />
      </Group>
    );
  }
}

export default Tag;
