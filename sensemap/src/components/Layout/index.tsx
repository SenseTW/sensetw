import * as React from 'react';
import { Group } from 'react-konva';
import Nothing from './Nothing';
import { Transform } from '../../graphics/point';
import { noop } from '../../types/utils';

export interface TransformerForProps {
  transform: Transform;
  inverseTransform: Transform;
}

export interface LayoutForProps {
  onResize(width: number, height: number): void;
}

interface OwnProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  x?: number;
  y?: number;
  margin?: number;
}

// XXX: should I pass transformers automatically?
type Props = OwnProps & LayoutForProps;

interface State {
  width: number;
  height: number;
}

class Layout extends React.PureComponent<Props, State> {
  state = {
    width: 0,
    height: 0,
  };

  handleHeadResize = (width: number, height: number): void => {
    this.setState({ width, height });
  }

  handleTailResize = (width: number, height: number): void => {
    const { direction = 'row', margin = 0, onResize = noop } = this.props;
    onResize(
      direction === 'row'
        ? this.state.width + margin + width
        : Math.max(this.state.width, width),
      direction === 'column'
        ? this.state.height + margin + height
        : Math.max(this.state.height, height),
    );
  }

  render(): React.ReactNode {
    const {
      children,
      direction = 'row',
      x = 0,
      y = 0,
      margin = 0,
      onResize = noop,
    } = this.props;
    const { width, height } = this.state;
    const [c, ...cs] = React.Children.toArray(children);
    const headRendered = width !== 0 || height !== 0;

    if (c === undefined) {
      return <Nothing onResize={onResize} />;
    }

    return (
      <Group x={x} y={y}>
        {
          React.cloneElement(
            c as React.ReactElement<LayoutForProps>,
            { onResize: this.handleHeadResize }
          )
        }
        {
          headRendered &&
          <Layout
            direction={direction}
            onResize={this.handleTailResize}
            {...(
              direction === 'row'
                ? { x: width + margin }
                : direction === 'column'
                    ? { y: height + margin }
                    : null as never
            )}
          >
            {cs}
          </Layout>
        }
      </Group>
    );
  }
}

export default Layout;