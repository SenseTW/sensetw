import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';

export interface Props {
  children: JSX.Element;
}

export class Dragged extends React.Component<Props> {
  el: HTMLElement;

  constructor(props: Props) {
    super(props);
    this.el = document.createElement('div');
    this.el.className = 'dragged';
  }

  componentWillMount() {
    const root = document.getElementById('modal-root');
    if (!!root) {
      root.appendChild(this.el);
    }
  }

  componentWillUnmount() {
    const root = document.getElementById('modal-root');
    if (!!root) {
      root.removeChild(this.el);
    }
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el,
    );
  }
}

export default Dragged;
