import * as React from 'react';
import { Icon } from 'semantic-ui-react';
import * as U from '../../types/utils';
import './index.css';

interface Props {
  className?: string;
  // tslint:disable-next-line:no-any
  style?: any;
  open: boolean;
  onToggle?(open: boolean): void;
}

class InboxToggler extends React.PureComponent<Props> {
  render() {
    const { className = '', style, open, onToggle = U.noop } = this.props;

    return (
      <div
        className={`${className} inbox-toggler`}
        style={style}
        onClick={() => onToggle(!open)}
      >
      {
        open
          ? <Icon name="caret left" />
          : <Icon name="caret right" />
      }
      </div>
    );
  }
}

export default InboxToggler;