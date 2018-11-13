import * as React from 'react';
import { TransformerForProps, LayoutForProps } from '../../Layout';
import Text from '../../Layout/Text';
import Nothing from '../../Layout/Nothing';
import { transformObject } from '../../../types/viewport';
import { MAP_TIME_FORMAT, MAP_DETAILED_TIME_FORMAT, noop } from '../../../types/utils';
import * as moment from 'moment';

interface OwnProps {
  x?: number;
  y?: number;
  width?: number;
  name?: string;
  time: number;
}

type Props = OwnProps & TransformerForProps & LayoutForProps;

enum RenderMode {
  FULL,
  SIMPLE,
  NONE,
}

interface OwnState {
  width: number;
  height: number;
  mode: RenderMode;
}

class Creator extends React.PureComponent<Props, OwnState> {

  static style = {
    fontSize: 10,
    color: '#9b9ca9',
  };

  state = {
    width: 0,
    height: 0,
    mode: RenderMode.FULL,
  };

  handleResize = (renderWidth: number, renderHeight: number) => {
    const { width = 0, onResize = noop } = this.props;
    const { mode } = this.state;

    switch (mode) {
      case RenderMode.FULL:
        if (renderWidth > width) {
          this.setState({ mode: RenderMode.SIMPLE });
          return;
        }
        break;
      case RenderMode.SIMPLE:
        if (renderWidth > width) {
          this.setState({ mode: RenderMode.NONE });
          return;
        }
        break;
      case RenderMode.NONE:
      default:
    }

    this.setState({ width: renderWidth, height: renderHeight });
    onResize(renderWidth, renderHeight);
  }

  render() {
    const { transform, x = 0, y = 0, name = '', time } = this.props;
    const m = moment(time);
    const dateStr = m.format(MAP_TIME_FORMAT);
    const detailedDateStr = m.format(MAP_DETAILED_TIME_FORMAT);
    const nameStr = name ? ` by ${name}` : '';
    const { mode } = this.state;
    const style = transformObject(transform, Creator.style) as typeof Creator.style;
    const props = {
      x,
      y,
      fontSize: style.fontSize,
      fill: style.color,
      onResize: this.handleResize
    };

    switch (mode) {
      case RenderMode.FULL:
        return <Text {...props} text={detailedDateStr + nameStr} />;
      case RenderMode.SIMPLE:
        return <Text {...props} text={dateStr + nameStr} />;
      case RenderMode.NONE:
      default:
        return <Nothing onResize={this.handleResize} />;
    }
  }
}

export default Creator;