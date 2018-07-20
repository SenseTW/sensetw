import * as React from 'react';
import { Group, Rect, Text } from 'react-konva';
import TagList from '../../TagList';
import { toTags } from '../../../../types/utils';

interface Props {
  box: { title: string, tags: string };
  x: number;
  y: number;
  width: number;
  height: number;
}

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
    const { box, width, height } = this.props;
    const { tagHeight } = this.state;
    const sanitizedTitle = box.title.substr(0, Header.style.contents.title.textLimit);
    return (
      <Group>
        <Rect
          fill={Header.style.background.color}
          width={width}
          height={height}
          stroke={Header.style.border.color}
          strokeWidth={Header.style.border.width}
          cornerRadius={Header.style.cornerRadius}
        />
        <Text
          x={Header.style.contents.title.left}
          y={Header.style.contents.title.top}
          width={Header.style.contents.title.width}
          fill={Header.style.contents.title.color}
          fontFamily={Header.style.contents.title.font.family}
          fontSize={Header.style.contents.title.font.size}
          lineHeight={Header.style.contents.title.lineHeight}
          text={sanitizedTitle}
        />
        <TagList
          x={Header.style.contents.tags.left}
          y={height - Header.style.contents.tags.bottom - tagHeight}
          width={width - 2 * Header.style.contents.tags.left}
          tags={toTags(box.tags)}
          onResize={(w, h) => this.setState({ tagHeight: h })}
        />
      </Group>
    );
  }
}

export default Header;
