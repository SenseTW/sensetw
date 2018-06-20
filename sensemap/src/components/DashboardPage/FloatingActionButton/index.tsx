import * as React from 'react';
import { Button } from 'semantic-ui-react';
import './index.css';

const FloatingActionButton = (props: {}) => (
  <Button circular className="floating-action-button" icon="plus" size="massive" />
);

export default FloatingActionButton;