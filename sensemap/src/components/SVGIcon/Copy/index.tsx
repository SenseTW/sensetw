import * as React from 'react';
import SVGIcon, { Props } from '../';

// tslint:disable:max-line-length
class Copy extends React.PureComponent<Props> {
  render() {
    return (
      <SVGIcon {...this.props}>
        <title>icon / copy</title>
        <g id="icon-/-copy" stroke="none" fill="currentColor" fillRule="evenodd">
          <path d="M17,2 L5,2 C3.9,2 3,2.9 3,4 L3,18 L5,18 L5,4 L17,4 L17,2 Z M19.1333333,6 L8.86666667,6 C7.84,6 7,6.8 7,7.77777778 L7,20.2222222 C7,21.2 7.84,22 8.86666667,22 L19.1333333,22 C20.16,22 21,21.2 21,20.2222222 L21,7.77777778 C21,6.8 20.16,6 19.1333333,6 Z M19,20 L9,20 L9,8 L19,8 L19,20 Z" />
        </g>
      </SVGIcon>
    );
  }
}

export default Copy;
