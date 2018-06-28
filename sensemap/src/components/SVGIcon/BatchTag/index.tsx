import * as React from 'react';
import SVGIcon, { Props } from '../';

// tslint:disable:max-line-length
class BatchTag extends React.PureComponent<Props> {
  render() {
    return (
      <SVGIcon {...this.props}>
        <title>icon / batch tag</title>
        <g id="icon-/-batch-tag" stroke="none" fill="currentColor" fillRule="evenodd" transform="translate(4.0, 2.0)">
          <path d="M0,8.8 C0,9.24 0.176,9.64 0.472,9.936 L7.672,17.136 C7.96,17.424 8.36,17.6 8.8,17.6 C9.24,17.6 9.64,17.424 9.928,17.128 L15.46,11.596 L15.528,11.664 C15.816,11.952 16,12.36 16,12.8 C16,13.24 15.824,13.64 15.528,13.928 L9.928,19.528 C9.64,19.824 9.24,20 8.8,20 C8.36,20 7.96,19.824 7.672,19.536 L0.472,12.336 C0.176,12.04 0,11.64 0,11.2 L0,8.8 Z" />
          <path d="M15.528,7.664 L8.328,0.464 C8.04,0.176 7.64,0 7.2,0 L1.6,0 C0.72,0 0,0.72 0,1.6 L0,7.2 C0,7.64 0.176,8.04 0.472,8.336 L7.672,15.536 C7.96,15.824 8.36,16 8.8,16 C9.24,16 9.64,15.824 9.928,15.528 L15.528,9.928 C15.824,9.64 16,9.24 16,8.8 C16,8.36 15.816,7.952 15.528,7.664 Z M2.8,4 C2.136,4 1.6,3.464 1.6,2.8 C1.6,2.136 2.136,1.6 2.8,1.6 C3.464,1.6 4,2.136 4,2.8 C4,3.464 3.464,4 2.8,4 Z" />
        </g>
      </SVGIcon>
    );
  }
}

export default BatchTag;
