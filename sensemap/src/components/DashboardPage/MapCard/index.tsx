import * as React from 'react';
import { Link } from 'react-router-dom';
import { Card, Image, Label, Button, Icon, Dropdown } from 'semantic-ui-react';
import * as R from '../../../types/routes';
import * as SM from '../../../types/sense/map';
import * as U from '../../../types/utils';
import './index.css';

interface Props {
  id?: string;
  data: SM.MapData;
  onEdit?(): void;
}

enum MapActionType {
  SHOW_MEMBER = 'SHOW_MEMBER',
  EDIT = 'EDIT',
  LEAVE = 'LEAVE',
}

interface DropdownItemProps {
  key?: number;
  text: string;
  value: MapActionType;
}

const dropdownOptions: DropdownItemProps[] = [{
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

class MapCard extends React.Component<Props> {
  render() {
    const { id, data, onEdit = U.noop } = this.props;

    return (
      <Card id={id} className="map-card">
        <Card.Content className="map-card__header">
          <Card.Header>
            <Icon float="left" name={data.type === SM.MapType.PUBLIC ? 'globe' : 'lock'} />
            Owned by <span className="map-card__username">Ael</span>
          </Card.Header>
        </Card.Content>
        <Image src={data.image || 'https://picsum.photos/360/200'} />
        <Card.Content extra className="map-card__content">
          {
            data.name &&
            <Card.Header>{data.name}</Card.Header>
          }
          {
            data.description &&
            <Card.Description>{data.description}</Card.Description>
          }
          {
            data.tags &&
            <Card.Meta className="map-card__tags">
              {U.toTags(data.tags).map((t, i) => <Label key={i}>{t}</Label>)}
            </Card.Meta>
          }
        </Card.Content>
        <Card.Content extra className="map-card__actions">
          <Button.Group widths={2}>
            <Button as={Link} to={R.toMapPath({ mid: data.id })}>enter</Button>
            <Button disabled>share</Button>
          </Button.Group>
          <Dropdown
            icon="ellipsis horizontal"
            pointing="bottom left"
            options={dropdownOptions}
            // tslint:disable-next-line:no-any
            onChange={(event: any, item: DropdownItemProps) => {
              if (item.value === MapActionType.EDIT) {
                onEdit();
              }
            }}
          />
        </Card.Content>
      </Card>
    );
  }
}

export default MapCard;