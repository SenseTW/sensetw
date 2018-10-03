import * as React from 'react';
import { Button } from 'semantic-ui-react';
import { ActionProps } from '../../../types';

interface StateFromProps {
  id?: string;
  className?: string;
  mapId: string;
}

type Props = StateFromProps & ActionProps;

type ClickEvent = React.SyntheticEvent<HTMLElement>;

const SyncButton = ({ id, className = '', mapId, actions: act }: Props) => (
  <Button
    id={id}
    basic
    icon="refresh"
    className={`inbox__sync-btn ${className}`}
    // tslint:disable-next-line:no-console
    onClick={(e: ClickEvent) => { console.log(e); act.senseObject.loadCards(mapId); }}
  />
);

export default SyncButton;
