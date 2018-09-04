import * as React from 'react';
import { Group } from 'react-konva';
import Tag from '../Tag';
import { TransformerForProps } from '../../Layout';
import { transformObject } from '../../../types/viewport';
import { noop } from '../../../types/utils';

interface OwnProps {
  x?: number;
  y?: number;
  width: number;
  height?: number;
  tags: string[];
  onResize?(w: number, h: number): void;
}

type Props = OwnProps & TransformerForProps;

interface State {
  w: number;
  h: number;
}

class TagList extends React.PureComponent<Props, State> {
  static style = {
    padding: 4,
    backgroundColor: '#d8d8d8',
    color: '#000000',
    borderRadius: 4,
    fontSize: 14,
    margin: { right: 9 },
  };

  state = {
    w: 0,
    h: 0,
  };

  handleResize = (w: number, h: number) => {
    const { onResize = noop } = this.props;

    // notify the parent my width and height.
    onResize(w, h);
    this.setState({ w, h });
  }

  handleRestResize = (w: number, h: number) => {
    const { transform, onResize = noop } = this.props;
    const style = transformObject(transform, TagList.style) as typeof TagList.style;
    const { w: width, h: height } = this.state;

    // My children resized, notify my parent about the new width and height.
    onResize(width + style.margin.right + w, h > height ? h : height);
  }

  render(): React.ReactNode {
    const {
      transform,
      inverseTransform,
      x = 0,
      y = 0,
      width = 0,
      height = Infinity,
      tags,
    } = this.props;
    const style = transformObject(transform, TagList.style) as typeof TagList.style;
    const { w } = this.state;
    const [t = '', ...ts] = tags;

    return (
      <Group x={x} y={y}>
        <Tag
          width={width}
          height={height}
          padding={style.padding}
          backgroundColor={style.backgroundColor}
          color={style.color}
          cornerRadius={style.borderRadius}
          fontSize={style.fontSize}
          text={t}
          onResize={this.handleResize}
        />
        {
          t.length !== 0 &&
          <TagList
            transform={transform}
            inverseTransform={inverseTransform}
            x={w + style.margin.right}
            width={width - w - style.margin.right}
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
