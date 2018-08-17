import * as React from 'react';
import { Group, Rect } from 'react-konva';
import Text from '../../Layout/Text';
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
class Tag extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      index: this.props.text.length,
      w: 0,
      h: 0,
    };
  }

  handleResize = (w: number, h: number) => {
    const { width = 0, height = 0 } = this.props;
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
      this.setState({ index: index - 1, w, h });
      return;
    }

    this.setState({ w, h });
    onResize(tagWidth, tagHeight);
  }

  componentDidUpdate(prevProps: Props) {
    const { width: prevWidth = 0, height: prevHeight = 0, text: prevText } = prevProps;
    const { width = 0, height = 0, text } = this.props;
    const { w, h } = this.state;

    if (width !== prevWidth || height !== prevHeight || text !== prevText) {
      // reset
      this.setState({ index: text.length });
      this.handleResize(w, h);
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
          x={tagPadding}
          y={tagPadding}
          fontSize={tagFontSize}
          fill={tagColor}
          text={slicedText}
          onResize={this.handleResize}
        />
      </Group>
    );
  }
}

export default Tag;
