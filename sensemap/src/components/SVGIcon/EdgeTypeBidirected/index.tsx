import * as React from 'react';
import SVGIcon, { Props } from '..';

class EdgeTypeBidirected extends React.PureComponent<Props> {
  render() {
    return (
      <SVGIcon {...this.props}>
        <title>icon / edge-type / bidirected</title>
        <g id="icon/edge-type/bidirected" stroke="currentColor" strokeWidth={1}>
          <path d="M5,19L19,5" />
          <g transform="rotate(-45,19,5) translate(19,5)">
            <circle r={5} stroke="none" fill="currentColor" />
            <path d="M-2,-3.464L4,0L-2,3.464Z" stroke="none" fill="white" />
          </g>
          <g transform="rotate(-45,5,19) translate(5,19)">
            <circle r={5} stroke="none" fill="currentColor" />
            <path d="M2,3.464L-4,0L2,-3.464Z" stroke="none" fill="white" />
          </g>
        </g>
      </SVGIcon>
    );
  }
}

export default EdgeTypeBidirected;