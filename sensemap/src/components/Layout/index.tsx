import * as React from 'react';
import { Group } from 'react-konva';
import Nothing from './Nothing';
import { Transform } from '../../graphics/point';
import { GetComponentProps, noop } from '../../types/utils';

export interface TransformerForProps {
  transform: Transform;
  inverseTransform: Transform;
}

export interface LayoutForProps {
  onResize?(width: number, height: number): void;
}

interface OwnProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  margin?: number;
}

// XXX: should I pass transformers automatically?
type Props = OwnProps & GetComponentProps<Group> & LayoutForProps;

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
    const { direction = 'row', onResize = noop } = this.props;

    // XXX: a dirty hack to remove the trailing margin
    let { margin = 0 } = this.props;
    if (width === 0 && height === 0) {
      margin = 0;
    }

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
      ...props
    } = this.props;
    const { width, height } = this.state;
    const [c, ...cs] = React.Children.toArray(children);
    const headRendered = width !== 0 || height !== 0;

    if (c === undefined) {
      return <Nothing onResize={onResize} />;
    }

    return (
      <Group {...props} x={x} y={y}>
        {
          React.cloneElement(
            c as React.ReactElement<LayoutForProps>,
            { onResize: this.handleHeadResize } as LayoutForProps
          )
        }
        {
          headRendered &&
          <Layout
            direction={direction}
            margin={margin}
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