import * as React from 'react';
import { Button, Icon, Pagination, PaginationProps } from 'semantic-ui-react';
import './index.css';
import * as T from '../../types';
import AddCardButton from './AddCardButton';
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
      <Button secondary icon labelPosition="right" onClick={closeInbox}>INBOX <Icon name="arrow left" /></Button>
      <AddCardButton />
      <Pager data={cards} pageSize={12}>
        {({ data, totalPages, currentPage, handlePageChange }) => {
          return (
            <React.Fragment>
              <CardList cards={data} />
              <Pagination
                className="inbox__pagination"
                defaultActivePage={currentPage}
                totalPages={totalPages}
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
