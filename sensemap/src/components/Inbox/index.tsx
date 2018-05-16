import * as React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import './index.css';
import * as T from '../../types';
import AddCardButton from './AddCardButton';
import CardList from './CardList';
import Pager, * as P from './Pager';

export interface StateFromProps {
  cards: T.CardData[];
  pager: P.Props;
}

export interface DispatchFromProps {}

export interface OwnProps {}

export type Props = StateFromProps & DispatchFromProps & OwnProps;

export function Inbox({ cards, pager }: Props) {
  return (
    <div className="inbox">
      <Button secondary icon labelPosition="right">INBOX <Icon name="arrow left" /></Button>
      <AddCardButton />
      <CardList cards={cards} />
      <Pager {...pager} />
    </div>
  );
}

export default Inbox;
