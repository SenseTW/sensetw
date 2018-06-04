import * as React from 'react';
import { Button, Icon, Pagination, PaginationProps } from 'semantic-ui-react';
import './index.css';
import * as T from '../../types';
import * as C from '../../types/sense/card';
import CardList from './CardList';
import { Pager } from '../Pager';

export interface StateFromProps {
  cards: T.CardData[];
  senseMap: T.State['senseMap'];
}

export interface DispatchFromProps {
  actions: {
    closeInbox(): T.ActionChain,
    createCard(mapId: T.MapID, card: T.CardData): T.ActionChain,
    stageInboxRect(rect: DOMRect | ClientRect): T.ActionChain,
  };
}

export interface OwnProps {}

export type Props = StateFromProps & DispatchFromProps & OwnProps;

export class Inbox extends React.Component<Props> {
  animationId: number = 0;
  inboxElement: HTMLElement | null = null;

  componentDidMount() {
    this.animationId = requestAnimationFrame(this.updateBoundingRect);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.animationId);
    this.animationId = 0;
  }

  updateBoundingRect = () => {
    if (this.inboxElement) {
      const rect = this.inboxElement.getBoundingClientRect();
      this.props.actions.stageInboxRect(rect);
    }
    this.animationId = requestAnimationFrame(this.updateBoundingRect);
  }

  render () {
    const { cards, senseMap, actions } = this.props;
    const mapId = senseMap.map;
    return (
      <div className="inbox" ref={elem => this.inboxElement = elem}>
        <div className="inbox__close-btn">
          <Button icon labelPosition="right" onClick={actions.closeInbox}>
            INBOX <Icon name="arrow left" />
          </Button>
        </div>
        <div className="inbox__add-card-btn">
          <Button icon="plus" size="tiny" color="grey" onClick={() => actions.createCard(mapId, C.cardData())} />
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
}

export default Inbox;
