import * as React from 'react';
import { Button } from 'semantic-ui-react';
import './index.css';

const SyncButton = (props: {}) => (
  <Button basic disabled icon="refresh" className="inbox__sync-btn" />
);

export default SyncButton;