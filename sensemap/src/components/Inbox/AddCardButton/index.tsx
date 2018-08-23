import * as React from 'react';
import * as C from '../../../types/sense/card';
import * as SN from '../../../types/session';
import { ActionProps } from '../../../types';
import { Button } from 'semantic-ui-react';
import './index.css';

interface StateFromProps {
  mapId: string;
  visible: boolean;
  session: SN.State;
}

export type Props = StateFromProps & ActionProps;

export default function AddCardButton({mapId, visible, session, actions: acts}: Props) {
  function onClick() {
        acts.senseObject.createCard(mapId, C.cardData(), session.user);
        acts.senseMap.activateInboxPage(1);
  }
  const className = visible ? 'inbox__add-card-btn' : 'inbox__add-card-btn hidden';
  return (
    <div className={className}>
      <Button icon="plus" size="tiny" color="grey" onClick={onClick} />
    </div>
  );
}
