import * as React from 'react';
import { Link } from 'react-router-dom';
import { Card, Image, Label, Button, Icon, Dropdown } from 'semantic-ui-react';
import { DropdownProps } from 'semantic-ui-react/src/modules/Dropdown';
import { DropdownItemProps } from 'semantic-ui-react/src/modules/Dropdown/DropdownItem';
import * as R from '../../../types/routes';
import * as SM from '../../../types/sense/map';
import * as U from '../../../types/utils';
import * as moment from 'moment';
import './index.css';

interface Props {
  id?: string;
  data: SM.MapData;
  onEdit?(map: SM.MapData): void;
  onRemove?(map: SM.MapData): void;
}

enum MapActionType {
  SHOW_MEMBER = 'SHOW_MEMBER',
  EDIT        = 'EDIT',
  REMOVE      = 'REMOVE',
  // TODO: member system
  LEAVE       = 'LEAVE',
}

const dropdownOptions: DropdownItemProps[] = [{
  key: 0,
  disabled: true,
  text: 'member',
  value: MapActionType.SHOW_MEMBER,
}, {
  key: 1,
  text: 'edit detail',
  value: MapActionType.EDIT,
}, {
  key: 2,
  text: 'delete',
  value: MapActionType.REMOVE,
}];

class MapCard extends React.Component<Props> {
  render() {
    const {
      id,
      data,
      onEdit = U.noop,
      onRemove = U.noop,
    } = this.props;
    const formattedTime = moment(data.updatedAt).format(U.TIME_FORMAT);
    const timeHint = data.createdAt === data.updatedAt
      ? `created at ${formattedTime}`
      : `updated at ${formattedTime}`;

    return (
      <Card id={id} className="map-card">
        <Card.Content className="map-card__header">
          <Card.Header title={timeHint}>
            <Icon float="left" name={data.type === SM.MapType.PUBLIC ? 'globe' : 'lock'} />
            Owned by <span className="map-card__username">{data.owner.username}</span>
          </Card.Header>
        </Card.Content>
        <Image src={data.image || 'https://picsum.photos/360/200'} />
        <Card.Content extra className="map-card__content">
          {
            data.name &&
            <Card.Header title={timeHint}>{data.name}</Card.Header>
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
            onChange={(event: any, item: DropdownProps) => {
              switch (item.value) {
                case MapActionType.EDIT:
                  onEdit(data);
                  break;
                case MapActionType.REMOVE:
                  onRemove(data);
                  break;
                default:
              }
            }}
          />
        </Card.Content>
      </Card>
    );
  }
}

export default MapCard;
