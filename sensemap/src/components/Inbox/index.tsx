import * as React from 'react';
import { Pagination, PaginationProps, Modal, Button } from 'semantic-ui-react';
import { CardData, State, ActionProps } from '../../types';
import Sources from '../../containers/Sources';
import AddCardButton from './AddCardButton';
import SyncButton from './SyncButton';
import Divider from './Divider';
import CardList from './CardList';
import { Pager } from '../Pager';
import './index.css';

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
      <div className="inbox__actions">
        <SyncButton className="inbox__action" mapId={mapId} actions={acts} />
        <Divider />
        <Modal
          trigger={
            <Button
              basic
              className="inbox__action"
            >
              Show Sources
            </Button>
          }
        >
          <Modal.Content>
            <Sources />
          </Modal.Content>
        </Modal>
      </div>
      <AddCardButton mapId={mapId} visible={senseMap.activateInboxPage === 1} actions={acts} />
      <Pager data={cards} pageSize={9} currentPage={senseMap.activateInboxPage} >
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
                    acts.senseMap.activateInboxPage(newProps.activePage);
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
