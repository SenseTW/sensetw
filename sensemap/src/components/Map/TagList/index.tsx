import * as React from 'react';
import { Group } from 'react-konva';
import Tag from '../Tag';
import { noop } from '../../../types/utils';

interface Props {
  x?: number;
  y?: number;
  width: number;
  height?: number;
  tags: string[];
  onResize?(w: number, h: number): void;
}

interface State {
  w: number;
  h: number;
}

const tagMargin = 9;

class TagList extends React.Component<Props, State> {
  state = {
    w: 0,
    h: 0,
  };

  handleResize = (w: number, h: number) => {
    const { tags, onResize = noop } = this.props;
    const [, ...ts] = tags;

    this.setState({ w, h });

    // I am the last tag, notify the parent my width and height.
    if (ts.length === 0) {
      onResize(w, h);
    }
  }

  handleRestResize = (w: number, h: number) => {
    const { onResize = noop } = this.props;
    const { w: width } = this.state;

    // My children resized, notify my parent about the new width and height.
    onResize(width + tagMargin + w, h);
  }

  render(): React.ReactNode {
    const { x = 0, y = 0, width = 0, height = Infinity, tags } = this.props;
    const { w } = this.state;
    const [t, ...ts] = tags;

    if (t === undefined) {
      return false;
    }

    return (
      <Group x={x} y={y}>
        <Tag
          width={width}
          height={height}
          text={t}
          onResize={this.handleResize}
        />
        {
          ts.length !== 0 &&
          <TagList
            x={w + tagMargin}
            width={width - w - tagMargin}
            height={height}
            tags={ts}
            onResize={this.handleRestResize}
          />
        }
      </Group>
    );
  }
}

export default TagList;
