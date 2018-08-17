import * as React from 'react';
import { TextConfig, Text as KonvaText  } from 'konva';
import { Text as ReactKonvaText } from 'react-konva';

interface OwnProps {
  onResize?(width: number, height: number): void;
}

type Props = OwnProps & TextConfig;

class Text extends React.PureComponent<Props> {
  textNode: KonvaText | null = null;

  handleResize() {
    if (!this.textNode) { return; }

    const { onResize } = this.props;
    const width = this.textNode.getWidth();
    const height = this.textNode.getHeight();

    if (onResize) { onResize(width, height); }
  }

  componentDidMount() {
    this.handleResize();
  }

  componentDidUpdate() {
    this.handleResize();
  }

  render() {
    const { text, onResize, ...props } = this.props;

    return (
      // tslint:disable-next-line:no-any
      <ReactKonvaText {...props} text={text} ref={(node: any) => this.textNode = node} />
    );
  }
}

export default Text;