import * as React from 'react';
import SVGIcon, { Props } from '../';

// tslint:disable:max-line-length
class BoxCard extends React.PureComponent<Props> {
  render() {
    return (
      <SVGIcon {...this.props}>
        <title>icon / box card</title>
        <g id="icon-/-box-card" stroke="none" fill="currentColor" fill-rule="evenodd">
          <g transform="translate(2.000000, 4.000000)">
            <path d="M18,8.9998 C18,10.1038 17.104,10.9998 16,10.9998 L11.938,10.9998 C11.938,12.1038 11.042,12.9998 9.937,12.9998 C8.833,12.9998 7.937,12.1038 7.937,10.9998 L4,10.9998 C2.896,10.9998 2,10.1038 2,8.9998 L2,2.9998 C2,2.4478 2.448,1.9998 3,1.9998 L17,1.9998 C17.553,1.9998 18,2.4478 18,2.9998 L18,8.9998 Z M18,-0.0002 L2,-0.0002 C0.896,-0.0002 0,0.8958 0,1.9998 L0,13.9998 C0,15.1038 0.896,15.9998 2,15.9998 L18,15.9998 C19.104,15.9998 20,15.1038 20,13.9998 L20,1.9998 C20,0.8958 19.104,-0.0002 18,-0.0002 Z" mask="url(#mask-2)" />
          </g>
          <polygon points="15 9.75 12.75 9.75 12.75 7.5 11.25 7.5 11.25 9.75 9 9.75 9 11.25 11.25 11.25 11.25 13.5 12.75 13.5 12.75 11.25 15 11.25" />
        </g>
      </SVGIcon>
    );
  }
}

export default BoxCard;
