import * as React from 'react';
import { Button } from 'semantic-ui-react';
import { ActionProps } from '../../../types';
import './index.css';

interface StateFromProps {
  mapId: string;
}

type Props = StateFromProps & ActionProps;

const SyncButton = ({ mapId, actions: act }: Props) => (
  <Button
    basic
    icon="refresh"
    className="inbox__sync-btn"
    onClick={(e: any) => { console.log(e); act.senseObject.loadCards(mapId); }}
  />
);

export default SyncButton;
