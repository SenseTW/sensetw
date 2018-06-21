import * as React from 'react';
import { Button, Icon, Pagination, PaginationProps } from 'semantic-ui-react';
import './index.css';
import { CardData, State, ActionProps } from '../../types';
import * as C from '../../types/sense/card';
import SyncButton from './SyncButton';
import Divider from './Divider';
import Filter from './Filter';
import CardList from './CardList';
import { Pager } from '../Pager';

export interface StateFromProps {
  cards: CardData[];
  senseMap: State['senseMap'];
}

export interface OwnProps {}

export type Props = StateFromProps & ActionProps & OwnProps;

export function Inbox({ cards, senseMap, actions: acts }: Props) {
  const mapId = senseMap.map;
  return (
    <div className="inbox">
      <div className="inbox__close-btn">
        <Button icon labelPosition="right" onClick={acts.senseMap.closeInbox}>
          INBOX <Icon name="arrow left" />
        </Button>
      </div>
      <div className="inbox__actions">
        <SyncButton />
        <Divider />
        <Filter />
      </div>
      <div className="inbox__add-card-btn">
        <Button icon="plus" size="tiny" color="grey" onClick={() => acts.senseObject.createCard(mapId, C.cardData())} />
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
