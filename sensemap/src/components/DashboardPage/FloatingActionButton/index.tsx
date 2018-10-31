import * as React from 'react';
import { Button } from 'semantic-ui-react';
import './index.css';

interface Props {
  id?: string;
  onClick?(): void;
}

const FloatingActionButton = (props: Props) => (
  <Button
    circular
    id={props.id}
    className="floating-action-button"
    icon="plus"
    size="massive"
    onClick={props.onClick}
  />
);

export default FloatingActionButton;