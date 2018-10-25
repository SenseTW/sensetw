import * as React from 'react';
import SVGIcon, { Props } from '..';

class EdgeTypeDirected extends React.PureComponent<Props> {
  render() {
    return (
      <SVGIcon {...this.props}>
        <title>icon / edge-type / directed</title>
        <g id="icon/edge-type/directed" stroke="currentColor" strokeWidth={1}>
          <path d="M2.071,21.929L21.929,2.071" />
          <g transform="rotate(-45,12,12) translate(12,12)">
            <circle r={5} stroke="none" fill="currentColor" />
            <path d="M-2,-3.464L4,0L-2,3.464Z" stroke="none" fill="white" />
          </g>
        </g>
      </SVGIcon>
    );
  }
}

export default EdgeTypeDirected;