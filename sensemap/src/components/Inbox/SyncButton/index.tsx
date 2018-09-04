import * as React from 'react';
import { Button } from 'semantic-ui-react';
import { ActionProps } from '../../../types';

interface StateFromProps {
  className?: string;
  mapId: string;
}

type Props = StateFromProps & ActionProps;

type ClickEvent = React.SyntheticEvent<HTMLElement>;

const SyncButton = ({ className = '', mapId, actions: act }: Props) => (
  <Button
    basic
    icon="refresh"
    className={`inbox__sync-btn ${className}`}
    // tslint:disable-next-line:no-console
    onClick={(e: ClickEvent) => { console.log(e); act.senseObject.loadCards(mapId); }}
  />
);

export default SyncButton;
