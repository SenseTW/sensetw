import * as React from 'react';
import { Link } from 'react-router-dom';
import { Card, Image, Label, Button, Icon, Dropdown } from 'semantic-ui-react';
import * as R from '../../../types/routes';
import * as SM from '../../../types/sense/map';
import * as U from '../../../types/utils';
import './index.css';

interface Props {
  id?: string;
  key?: string | number;
  data: SM.MapData;
}

enum MapActionType {
  SHOW_MEMBER = 'SHOW_MEMBER',
  EDIT = 'EDIT',
  LEAVE = 'LEAVE',
}

const dropdownOptions = [{
  key: 0,
  text: 'member',
  value: MapActionType.SHOW_MEMBER,
}, {
  key: 1,
  text: 'edit detail',
  value: MapActionType.EDIT,
}, {
  key: 2,
  text: 'leave map',
  value: MapActionType.LEAVE,
}];

const MapCard = (props: Props) => (
  <Card id={props.id} className="map-card">
    <Card.Content className="map-card__header">
      <Card.Header>
        <Icon float="left" name={props.data.type === SM.MapType.PUBLIC ? 'globe' : 'lock'} />
        Owned by <span className="map-card__username">Ael</span>
      </Card.Header>
    </Card.Content>
    <Image src={props.data.image || 'https://picsum.photos/360/200'} />
    <Card.Content extra className="map-card__content">
      {
        props.data.name &&
        <Card.Header>{props.data.name}</Card.Header>
      }
      {
        props.data.description &&
        <Card.Description>{props.data.description}</Card.Description>
      }
      {
        props.data.tags &&
        <Card.Meta className="map-card__tags">
          {U.toTags(props.data.tags).map((t, i) => <Label key={i}>tag</Label>)}
        </Card.Meta>
      }
    </Card.Content>
    <Card.Content extra className="map-card__actions">
      <Button.Group widths={2}>
        <Button as={Link} to={R.map}>enter</Button>
        <Button disabled>share</Button>
      </Button.Group>
      <Dropdown icon="ellipsis horizontal" pointing="bottom left" options={dropdownOptions} />
    </Card.Content>
  </Card>
);

export default MapCard;