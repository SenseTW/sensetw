import * as React from 'react';
import { LayoutForProps } from '../';

class Nothing extends React.Component<LayoutForProps> {
  handleResize() {
    const { onResize } = this.props;
    if (typeof onResize === 'function') { onResize(0, 0); }
  }

  componentDidMount() { this.handleResize(); }

  componentDidUpdate() { this.handleResize(); }

  render() { return null; }
}

export default Nothing;