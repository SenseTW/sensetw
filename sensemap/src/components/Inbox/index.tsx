import * as React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import './index.css';
import AddCardButton from './AddCardButton';
import CardList from './CardList';
import Pager from './Pager';

interface Props {
}

export default function Inbox(props: Props) {
  return (
    <div className="inbox">
      <Button secondary icon labelPosition="right">INBOX <Icon name="arrow left" /></Button>
      <AddCardButton />
      <CardList />
      <Pager />
    </div>
  );
}
