import * as React from 'react';
import { Group, Rect, Text } from 'react-konva';
import TagList from '../../TagList';
import { TransformerForProps } from '../../../Layout';
import { transformObject } from '../../../../types/viewport';
import { toTags } from '../../../../types/utils';

interface OwnProps {
  box: { title: string, tags: string };
  x: number;
  y: number;
  width: number;
  height: number;
}

type Props = OwnProps & TransformerForProps;

interface State {
  tagHeight: number;
}

class Header extends React.Component<Props, State> {
  static style = {
    background: {
      color: '#ffffff',
    },
    cornerRadius: 4,
    border: {
      color: '#e5e5e5',
      width: 1
    },
    contents: {
      title: {
        left: 20,
        top: 18,
        color: '#000000',
        width: 320 - 20 * 2,
        height: 48,
        textLimit: 14 * 2,
        font: {
          family: 'sans-serif',
          size: 20,
        },
        lineHeight: 22 / 20,
      },
      tags: {
        left: 21,
        bottom: 8,
      }
    },
  };

  state = {
    tagHeight: 0,
  };

  render() {
    const { transform, inverseTransform, box, width, height } = this.props;
    const { tagHeight } = this.state;
    const style = transformObject(transform, Header.style) as typeof Header.style;
    const sanitizedTitle = box.title.substr(0, Header.style.contents.title.textLimit);
    return (
      <Group>
        <Rect
          fill={style.background.color}
          width={width}
          height={height}
          stroke={style.border.color}
          strokeWidth={style.border.width}
          cornerRadius={style.cornerRadius}
        />
        <Text
          x={style.contents.title.left}
          y={style.contents.title.top}
          width={style.contents.title.width}
          fill={style.contents.title.color}
          fontFamily={style.contents.title.font.family}
          fontSize={style.contents.title.font.size}
          lineHeight={style.contents.title.lineHeight}
          text={sanitizedTitle}
        />
        <TagList
          transform={transform}
          inverseTransform={inverseTransform}
          x={style.contents.tags.left}
          y={height - style.contents.tags.bottom - tagHeight}
          width={width - 2 * style.contents.tags.left}
          tags={toTags(box.tags)}
          onResize={(w, h) => this.setState({ tagHeight: h })}
        />
      </Group>
    );
  }
}

export default Header;
