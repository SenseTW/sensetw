import * as React from 'react';
import SVGIcon, { Props } from '../';

// tslint:disable:max-line-length
class Delete extends React.PureComponent<Props> {
  render() {
    return (
      <SVGIcon {...this.props}>
        <title>icon / delete</title>
        <g id="icon-/-delete" stroke="none" fill="currentColor" fillRule="evenodd">
          <path d="M6,19 C6,20.1 6.9,21 8,21 L16,21 C17.1,21 18,20.1 18,19 L18,7 L6,7 L6,19 Z M19,4 L15.5,4 L14.5,3 L9.5,3 L8.5,4 L5,4 L5,6 L19,6 L19,4 Z" />
        </g>
      </SVGIcon>
    );
  }
}

export default Delete;
