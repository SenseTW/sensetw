import * as React from 'react';
import SVGIcon, { Props } from '..';

class EdgeTypeNone extends React.PureComponent<Props> {
  render() {
    return (
      <SVGIcon {...this.props}>
        <title>icon / edge-type / none</title>
        <g id="icon/edge-type/none" stroke="currentColor" strokeWidth={1}>
          <path d="M2.071,21.929L21.929,2.071" />
        </g>
      </SVGIcon>
    );
  }
}

export default EdgeTypeNone;