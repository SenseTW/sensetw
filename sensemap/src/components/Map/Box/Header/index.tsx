import * as React from 'react';
import { Group, Rect } from 'react-konva';
import TagList from '../../TagList';
import { TransformerForProps, LayoutForProps } from '../../../Layout';
import Layout from '../../../Layout';
import Text from '../../../Layout/Text';
import { transformObject } from '../../../../types/viewport';
import { toTags, noop } from '../../../../types/utils';

interface OwnProps {
  box: { title: string, tags: string };
  x?: number;
  y?: number;
  width?: number;
  backgroundColor: string;
  color: string;
}

type Props = OwnProps & LayoutForProps & TransformerForProps;

interface State {
  width: number;
  height: number;
}

class Header extends React.PureComponent<Props, State> {

  static style = {
    width: 320,
    padding: {
      top: 18,
      right: 20,
      bottom: 18,
      left: 20,
    },
    textGap: 10,
    cornerRadius: 4,
    contents: {
      font: {
        family: 'sans-serif',
        size: 20,
      },
      lineHeight: 22 / 20,
    },
    tags: {
      left: 21,
      bottom: 8,
    },
  };

  state = {
    width: 0,
    height: 0,
  };

  handleResize = (width: number, height: number): void => {
    const { transform, onResize = noop } = this.props;
    const { padding } = transformObject(transform, Header.style) as typeof Header.style;
    this.setState({ width, height });
    onResize(
      padding.left + width + padding.right,
      padding.top + height + padding.bottom,
    );
  }

  render() {
    const { transform, inverseTransform, box, x = 0, y = 0, width = 0, backgroundColor, color } = this.props;
    const style = transformObject(transform, Header.style) as typeof Header.style;
    const { height: innerHeight } = this.state;
    const innerWidth = width - style.padding.left - style.padding.right;
    const height = style.padding.top + innerHeight + style.padding.bottom;
    const sanitizedTitle = box.title;

    return (
      <Group x={x} y={y}>
        <Rect
          fill={backgroundColor}
          width={width}
          height={height}
          cornerRadius={style.cornerRadius}
        />
        <Layout
          direction="column"
          x={style.padding.left}
          y={style.padding.top}
          onResize={this.handleResize}
        >
          <Text
            width={innerWidth}
            fill={color}
            fontFamily={style.contents.font.family}
            fontSize={style.contents.font.size}
            lineHeight={style.contents.lineHeight}
            text={sanitizedTitle}
          />
          {
            box.tags.length === 0
              ? null
              : (
                <TagList
                  transform={transform}
                  inverseTransform={inverseTransform}
                  width={innerWidth}
                  tags={toTags(box.tags)}
                />
              )
          }
        </Layout>
      </Group>
    );
  }
}

export default Header;
