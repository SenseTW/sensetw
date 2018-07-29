import * as React from 'react';
import { ShapeConfig } from 'konva';
import Text from '../Text';
import { noop } from '../../../types/utils';

/**
 * `Config` is a `TextConfig` without a `text`.
 */
interface Config extends ShapeConfig {
  fontFamily?: string;
  fontSize?: number;
  fontStyle?: string;
  align?: string;
  padding?: number;
  lineHeight?: number;
  wrap?: string;
  ellipsis?: boolean;
}

/**
 * TODO:
 *   1. direction: 'row' | 'column'
 *   2. accept children with the interface `{ onResize }`
 *   3. rename to `List`
 */
interface OwnProps {
  texts: string[];
  x?: number;
  y?: number;
  margin?: number;
  onResize?(width: number, height: number): void;
}

interface OwnState {
  width: number;
  height: number;
}

type Props = OwnProps & Config;

class TextList extends React.PureComponent<Props, OwnState> {
  state = {
    width: 0,
    height: 0,
  };

  handleTerminate = () => {
    const { onResize = noop } = this.props;
    onResize(0, 0);
  }

  handleHeadResize = (width: number, height: number) => {
    this.setState({ width, height });
  }

  handleTailResize = (width: number, height: number) => {
    const { margin = 0, onResize = noop } = this.props;
    onResize(width, this.state.height + margin + height);
  }

  render(): React.ReactNode {
    const {
      x = 0,
      y = 0,
      texts,
      margin = 0,
      onResize = noop,
      ...props
    } = this.props;

    if (texts.length === 0) {
      return (
        <Text text="" onResize={this.handleTerminate} />
      );
    }

    const [t, ...ts] = texts;
    const { width, height } = this.state;
    const headRendered = width !== 0 || height !== 0;

    return (
      <React.Fragment>
        <Text
          {...props}
          x={x}
          y={y}
          text={t}
          onResize={this.handleHeadResize}
        />
        {
          headRendered &&
          <TextList
            {...props}
            x={x}
            y={y + margin + height}
            margin={margin}
            texts={ts}
            onResize={this.handleTailResize}
          />
        }
      </React.Fragment>
    );
  }
}

export default TextList;