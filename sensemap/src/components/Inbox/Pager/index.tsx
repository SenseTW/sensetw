import * as React from 'react';
import { Label } from 'semantic-ui-react';
import './index.css';

export interface Props {
  pageLimit:    number;
  totalEntries: number;
  currentPage:  number;
}

function renderPageLabels({ pageCount, currentPage }: { pageCount: number, currentPage: number }) {
  return (
    <Label.Group className="pager__labels">
      {Array(pageCount).fill(0).map((_, i) =>
        (i === currentPage
          ?  <Label circular color={'black'} empty key={i} />
          :  <Label circular color={'grey'} empty key={i} />
        )
      )}
    </Label.Group>
  );
}

export default function Pager({ pageLimit, totalEntries, currentPage }: Props) {
  const pageCount = Math.ceil(totalEntries / pageLimit);
  return (
    <div className="pager">
      {renderPageLabels({ pageCount, currentPage })}
    </div>
  );
}
