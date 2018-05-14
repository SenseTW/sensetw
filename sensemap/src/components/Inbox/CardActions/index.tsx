import * as React from 'react';
import { Button } from 'semantic-ui-react';
import './index.css';

interface Props {
}

export default function CardActions(props: Props) {
  return (
    <div className="card-actions">
      <Button icon="edit" />
      <Button icon="plus square outline" />
      <Button icon="trash" />
    </div>
  );
}
