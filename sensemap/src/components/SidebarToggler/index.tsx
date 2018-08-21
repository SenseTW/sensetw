import * as React from 'react';
import { Icon } from 'semantic-ui-react';
import * as U from '../../types/utils';
import './index.css';

interface Props {
  className?: string;
  // tslint:disable-next-line:no-any
  style?: any;
  right?: boolean;
  open: boolean;
  onToggle?(open: boolean): void;
}

class SidebarToggler extends React.PureComponent<Props> {
  render() {
    const { className = '', style, right = false, open, onToggle = U.noop } = this.props;
    const openIconName = right ? 'caret right' : 'caret left';
    const closeIconName = right ? 'caret left' : 'caret right';

    return (
      <div
        className={`${className} inbox-toggler`}
        style={style}
        onClick={() => onToggle(!open)}
      >
      <Icon name={open ? openIconName : closeIconName} />
      </div>
    );
  }
}

export default SidebarToggler;