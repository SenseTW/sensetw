import * as React from 'react';
import { Link } from 'react-router-dom';
import { Card, Image, Label, Button, Icon } from 'semantic-ui-react';
import * as R from '../../../types/routes';
import * as SM from '../../../types/sense/map';
import * as U from '../../../types/utils';
import './index.css';

interface Props {
  id?: string;
  key?: string | number;
  data: SM.MapData;
}

const MapCard = (props: Props) => (
  <Card id={props.id} className="map-card" as={Link} to={R.map}>
    <Card.Content className="map-card__header">
      <Card.Header>Owned by <span className="map-card__username">Ael</span></Card.Header>
    </Card.Content>
    <Image src="https://picsum.photos/290" />
    <Card.Content extra className="map-card__content">
      <Card.Header>{props.data.name}</Card.Header>
      <Card.Description>{props.data.description}</Card.Description>
      <Card.Meta className="map-card__tags">
        {U.toTags(props.data.tags).map((t, i) => <Label key={i}>tag</Label>)}
      </Card.Meta>
    </Card.Content>
    <Card.Content extra className="map-card__actions">
      <Button.Group widths={4}>
        <Button>ENTER</Button>
        <Button>SHARE</Button>
        <Button>ANNOTATE</Button>
        <Button><Icon name="ellipsis horizontal" /></Button>
      </Button.Group>
    </Card.Content>
  </Card>
);

export default MapCard;