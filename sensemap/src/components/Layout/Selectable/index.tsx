import * as React from 'react';
import { KonvaNodeProps } from 'react-konva';

interface OwnProps {
  selected?: boolean;
  // tslint:disable-next-line:no-any
  onSelect?(e: any): void;
  // tslint:disable-next-line:no-any
  onDeselect?(e: any): void;
}

type Props = OwnProps & KonvaNodeProps;

interface State {
  newlySelected: boolean;
  moved: boolean;
}

class Selectable extends React.PureComponent<Props, State> {
  static defaultProps = {
    selected: false,
  };

  state = {
    newlySelected: false,
    moved: false,
  };

  // tslint:disable-next-line:no-any
  handleMouseDown = (e: any) => {
    const { selected, onMouseDown, onSelect } = this.props;

    if (typeof onSelect === 'function' && !selected) {
      onSelect(e);
      this.setState({ newlySelected: true, moved: false });
    } else {
      this.setState({ moved: false });
    }

    if (typeof onMouseDown === 'function') {
      onMouseDown(e);
    }
  }

  // tslint:disable-next-line:no-any
  handleClick = (e: any) => {
    const { selected, onClick, onDeselect } = this.props;
    const { newlySelected, moved } = this.state;

    if (typeof onDeselect === 'function' && selected && !newlySelected && !moved) {
      onDeselect(e);
    }
    this.setState({ newlySelected: false });

    if (typeof onClick === 'function') {
      onClick(e);
    }
  }

  // tslint:disable-next-line:no-any
  handleMouseMove = (e: any) => {
    const { onMouseMove } = this.props;

    this.setState({ moved: true });

    if (typeof onMouseMove === 'function') {
      onMouseMove(e);
    }
  }

  render() {
    const { children, onMouseDown, onClick, onMouseMove, ...props } = this.props;
    const child = React.Children.only(children);

    return React.cloneElement(child, {
      ...props,
      onMouseDown: this.handleMouseDown,
      onClick: this.handleClick,
      onMouseMove: this.handleMouseMove,
    });
  }
}

export default Selectable;