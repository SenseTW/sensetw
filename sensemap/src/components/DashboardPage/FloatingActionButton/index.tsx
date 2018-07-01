import * as React from 'react';
import { Button } from 'semantic-ui-react';
import './index.css';

const FloatingActionButton = (props: { onClick?(): void }) => (
  <Button circular className="floating-action-button" icon="plus" size="massive" onClick={props.onClick} />
);

export default FloatingActionButton;