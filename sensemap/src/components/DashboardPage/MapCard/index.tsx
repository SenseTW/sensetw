import * as React from 'react';
import { Card, Image, Label, Button, Icon } from 'semantic-ui-react';
import './index.css';

const MapCard = (props: {}) => (
  <Card className="map-card">
    <Card.Content className="map-card__header">
      <Card.Header>Owned by <span className="map-card__username">Ael</span></Card.Header>
    </Card.Content>
    <Image src="https://picsum.photos/290" />
    <Card.Content extra className="map-card__content">
      <Card.Header>A Wonderful Serenity Has Taken Possessio</Card.Header>
      <Card.Description>
        Far far away, behind the word mountains, far from the countries
        Vokalia and Consonantia, there live the blind texts. Separated
        they live in Bookmarksgrove right at the coast of the Semantics,
        a large language ocean. A small river named Duden flows by
      </Card.Description>
      <Card.Meta className="map-card__tags">
        <Label>tag</Label>
        <Label>tag</Label>
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