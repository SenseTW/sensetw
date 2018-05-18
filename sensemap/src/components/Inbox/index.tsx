import * as React from 'react';
import { Button, Icon, Pagination, PaginationProps } from 'semantic-ui-react';
import './index.css';
import * as T from '../../types';
import CardList from './CardList';
import { Pager } from '../Pager';

export interface StateFromProps {
  cards: T.CardData[];
}

export interface DispatchFromProps {
  actions: {
    closeInbox(): T.ActionChain,
  };
}

export interface OwnProps {}

export type Props = StateFromProps & DispatchFromProps & OwnProps;

export function Inbox({ cards, actions: { closeInbox } }: Props) {
  return (
    <div className="inbox">
      <div className="inbox__close-btn">
        <Button icon labelPosition="right" onClick={closeInbox}>
          INBOX <Icon name="arrow left" />
        </Button>
      </div>
      <div className="inbox__add-card-btn">
        <Icon name="plus" />
      </div>
      <Pager data={cards} pageSize={9}>
        {({ data, totalPages, currentPage, handlePageChange }) => {
          return (
            <React.Fragment>
              <CardList cards={data} />
              <Pagination
                className="inbox__pagination"
                defaultActivePage={currentPage}
                totalPages={totalPages}
                boundaryRange={0}
                siblingRange={0}
                onPageChange={(_, newProps: PaginationProps) => {
                  if (typeof newProps.activePage === 'number'
                      && Number.isInteger(newProps.activePage)) {
                    handlePageChange(newProps.activePage);
                  }
                }}
              />
            </React.Fragment>
          );
        }}
      </Pager>
    </div>
  );
}

export default Inbox;
