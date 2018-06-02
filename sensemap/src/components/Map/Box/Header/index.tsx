import * as React from 'react';
import { Group, Rect, Text } from 'react-konva';
import TagList from '../../TagList';
import { toTags } from '../../../../types/utils';

interface Props {
  box: { title: string, tags: string };
  x: number;
  y: number;
}

class Header extends React.Component<Props> {

  static style = {
    width: 320,
    height: 130,
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
        top: 87,
      }
    },
  };

  render() {
    const { box } = this.props;
    const sanitizedTitle = box.title.substr(0, Header.style.contents.title.textLimit);
    return (
      <Group>
        <Rect
          fill={Header.style.background.color}
          width={Header.style.width}
          height={Header.style.height}
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
          y={Header.style.contents.tags.top}
          tags={toTags(box.tags)}
        />
      </Group>
    );
  }
}

export default Header;
