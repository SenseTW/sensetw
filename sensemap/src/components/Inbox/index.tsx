import * as React from 'react';
import { Pagination, PaginationProps, Modal, Button } from 'semantic-ui-react';
import { CardData, State, ActionProps } from '../../types';
import Sources from '../../containers/Sources';
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
      <h1>Inbox</h1>
      <div className="inbox__actions">
        <SyncButton
          id="sense-inbox__sync-btn"
          className="inbox__action"
          mapId={mapId}
          actions={acts}
        />
        <Divider />
        <Button
          basic
          id="sense-inbox__annotation-btn"
          className="inbox__action"
          as="a"
          href="https://via.sense.tw/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Add Source
        </Button>
        <Divider />
        <Modal
          trigger={
            <Button
              basic
              id="sense-inbox__show-sources-btn"
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
      <Pager data={cards} pageSize={10} currentPage={senseMap.activateInboxPage} >
        {({ data, totalPages, currentPage, handlePageChange }) => {
          return (
            <React.Fragment>
              <div className="inbox__content">
                <CardList cards={data} />
              </div>
              <div className="inbox__pagination">
                <Pagination
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
              </div>
            </React.Fragment>
          );
        }}
      </Pager>
    </div>
  );
}

export default Inbox;
