import * as React from 'react';
import { Icon } from 'semantic-ui-react';
import './index.css';

interface Props {
}

export default function AddCardButton(props: Props) {
  return (
    <div className="add-card-btn">
      <Icon name="plus" />
    </div>
  );
}
