import * as React from 'react';
import { Button } from 'semantic-ui-react';
import { ActionProps } from '../../../types';
import './index.css';

interface StateFromProps {
  mapId: string;
}

type Props = StateFromProps & ActionProps;

type ClickEvent = React.SyntheticEvent<HTMLElement>;

const SyncButton = ({ mapId, actions: act }: Props) => (
  <Button
    basic
    icon="refresh"
    className="inbox__sync-btn"
    // tslint:disable-next-line:no-console
    onClick={(e: ClickEvent) => { console.log(e); act.senseObject.loadCards(mapId); }}
  />
);

export default SyncButton;
