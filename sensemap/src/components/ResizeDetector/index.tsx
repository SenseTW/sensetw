import * as React from 'react';
import { connect } from 'react-redux';
import ReactResizeDetector from 'react-resize-detector';
import { height as desktopHeaderHeight } from '../Header/DesktopHeader';
import { height as mobileHeaderHeight } from '../Header/MobileHeader';
import { State, ActionProps, actions, mapDispatch } from '../../types';
import * as V from '../../types/viewport';

class ResizeDetector extends React.Component<ActionProps> {
  handleResize = (width: number, height: number) => {
    const { actions: acts } = this.props;
    const isMobile = V.isMobile({ width });
    const headerHeight = isMobile ? mobileHeaderHeight : desktopHeaderHeight;
    acts.viewport.resizeViewport({ width, height: height - headerHeight });

    if (width <= 640) {
      acts.viewport.setBaseLevel(0.5);
    } else if (width <= 800) {
      acts.viewport.setBaseLevel(0.6);
    } else if (width <= 1024) {
      acts.viewport.setBaseLevel(0.7);
    } else {
      acts.viewport.setBaseLevel(1.0);
    }
  }

  render() {
    return (
      <ReactResizeDetector
        handleWidth
        handleHeight
        resizableElementId="root"
        onResize={this.handleResize}
      />
    );
  }
}

export default connect<{}, ActionProps>(
  (state: State) => ({}),
  mapDispatch({ actions }),
)(ResizeDetector);