import * as React from 'react';
import { Label } from 'semantic-ui-react';
import './index.css';

interface Props {
}

export default function Pager(props: Props) {
  const pages = Array(16).fill(null);
  const pageLabels = (
    <Label.Group className="pager__labels">
      {pages.map((_, i) =>
        <Label circular color={'grey'} empty key={i} />
      )}
    </Label.Group>
  );
  return (
    <div className="pager">
      {pageLabels}
    </div>
  );
}
