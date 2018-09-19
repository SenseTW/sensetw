import * as React from 'react';
import { Icon } from 'semantic-ui-react';
import './index.css';

interface Props {
  title?: string;
}

interface State {
  open: boolean;
}

class Accordion extends React.PureComponent<Props, State> {

  state = {
    open: false,
  };

  handleClick = () => {
    this.setState({ open: !this.state.open });
  }

  render() {
    const { children, title = '' } = this.props;
    const { open } = this.state;

    return (
      <div className="accordion">
        <div className="accordion__handler" onClick={this.handleClick}>
          {title.length !== 0 && <label>{title}</label>}
          {
            open
              ? <Icon name="caret down" />
              : <Icon name="caret left" />
          }
        </div>
        {
          open &&
          <div className="accordion__content">
            {children}
          </div>
        }
      </div>
    );
  }

}

export default Accordion;